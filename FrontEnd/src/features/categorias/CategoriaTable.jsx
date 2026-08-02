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

            const categoriasComTransacoes = listaCategorias.map(cat => ({
                ...cat,
                transacoes: listaTransacoes.filter(
                    t => t.categoriaId === cat.id || t.categoria_id === cat.id || t.categoria?.id === cat.id
                )
            }));

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
            <h1>Gerenciar Categorias</h1>

            <button 
                className="btn-nova-categoria"
                onClick={() => setIsModalOpen(true)}
            >
                + Nova Categoria
            </button>

            <h3>Categorias e Transações Existentes</h3>
            
            <ul className="categorias-list">
                {categorias.map(cat => (
                    <li key={cat.id} className="categoria-item">
                        <strong className="categoria-nome">Categoria: {cat.nome}</strong>

                        <div className="transacoes-container">
                            <span className="transacoes-titulo">Transações:</span>
                            {cat.transacoes && cat.transacoes.length > 0 ? (
                                <ul className="transacoes-list">
                                    {cat.transacoes.map(transacao => (
                                        <li key={transacao.id} className="transacao-item">
                                            {/* Descrição da transação */}
                                            {transacao.descricao || transacao.nome || transacao.titulo} 
                                            
                                            {/* Valor formatado em Reais (R$ 0,00) */}
                                            {transacao.valor !== undefined && transacao.valor !== null ? (
                                                <span style={{ marginLeft: '8px', fontWeight: 'bold', color: transacao.tipo === 'despesa' ? '#d9534f' : '#5cb85c' }}>
                                                    {Number(transacao.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                </span>
                                            ) : ''}
                                        </li>
                                    ))}
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