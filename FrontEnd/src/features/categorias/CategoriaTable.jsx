import { useEffect, useState } from 'react';
import CategoriaForm from './CategoriaForm';
import api from '../../services/api';
import './CategoriaStyle.css';

function CategoriasPage() {
    const [categorias, setCategorias] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const carregarCategoriasETransacoes = async () => {
        try {
            const [resCategorias, resTransacoes] = await Promise.all([
                api.get('/api/categorias'),
                api.get('/api/transacoes') 
            ]);

            const listaCategorias = resCategorias.data;
            const listaTransacoes = resTransacoes.data;

            const categoriasComTransacoes = listaCategorias.map(cat => {
                const transacoesFiltradas = listaTransacoes.filter(
                    t => t.categoriaId === cat.id || t.categoria_id === cat.id || t.categoria?.id === cat.id
                );

                const subtotal = transacoesFiltradas.reduce((acc, t) => {
                    let valor = Number(t.valor) || 0;
                    
                    // Se t.receita for falso (ou 0), significa que é um gasto/despesa (valor negativo)
                    // Se for verdadeiro, é uma receita (valor positivo)
                    const isReceita = t.receita === true || t.receita === 1 || t.receita === 'true';

                    if (!isReceita) {
                        valor = -Math.abs(valor);
                    } else {
                        valor = Math.abs(valor);
                    }

                    return acc + valor;
                }, 0);

                return {
                    ...cat,
                    transacoes: transacoesFiltradas,
                    subtotal
                };
            });

            setCategorias(categoriasComTransacoes);
        } catch (err) {
            console.error("Erro ao buscar dados:", err);
        }
    };

    useEffect(() => {
        carregarCategoriasETransacoes();
    }, []);

    return (
        <div className="categorias-container">

            <button 
                className="btn-nova-categoria"
                onClick={() => setIsModalOpen(true)}
            >
                + Nova Categoria
            </button>

            
            <ul className="categorias-list">
                {categorias.map(cat => (
                    <li key={cat.id} className="categoria-item">
                        <div className="categoria-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong className="categoria-nome">Categoria: {cat.nome}</strong>
                            
                            <span 
                                className="categoria-subtotal" 
                                style={{ 
                                    fontWeight: 'bold', 
                                    color: cat.subtotal < 0 ? '#d9534f' : '#5cb85c' 
                                }}
                            >
                                Subtotal: {cat.subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                        </div>

                        <div className="transacoes-container">
                            <span className="transacoes-titulo">Transações:</span>
                            {cat.transacoes && cat.transacoes.length > 0 ? (
                                <ul className="transacoes-list">
                                    {cat.transacoes.map(transacao => {
                                        const isReceita = transacao.receita === true || transacao.receita === 1 || transacao.receita === 'true';

                                        return (
                                            <li key={transacao.id} className="transacao-item">
                                                {transacao.descricao || transacao.nome || transacao.titulo} 
                                                
                                                {transacao.valor !== undefined && transacao.valor !== null ? (
                                                    <span style={{ marginLeft: '8px', fontWeight: 'bold', color: !isReceita ? '#d9534f' : '#5cb85c' }}>
                                                        {!isReceita ? '-' : '+'} {Number(Math.abs(transacao.valor)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                    </span>
                                                ) : ''}
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <p className="sem-transacoes">Nenhuma transação cadastrada nesta categoria.</p>
                            )}
                        </div>
                    </li>
                ))}
            </ul>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <CategoriaForm
                            onSave={carregarCategoriasETransacoes}
                            onClose={() => setIsModalOpen(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default CategoriasPage;