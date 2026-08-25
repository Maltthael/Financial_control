import { useEffect, useState } from 'react';
import CategoriaForm from './CategoriaForm';
import api from '../../services/api';
import './CategoriaStyle.css';

function CategoriasPage() {
    const [categorias, setCategorias] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoriaEditando, setCategoriaEditando] = useState(false);

    const handleDeleteCategoria = async (categoria_id) => {
        try {
            await api.get(`/categorias/deletar/${categoria_id}`);
            carregarCategoriasETransacoes();

        } catch (err) {
            console.error("Erro ao deletar categoria:", err);
            alert("Não foi possivel excluir a categoria.");
        }
    }

    const abrirModalEdicao = (categoria) => {
        setCategoriaEditando(categoria);
        setIsModalOpen(true);
    };

    const abrirModalCriacao = () => {
        setCategoriaEditando(null);
        setIsModalOpen(true);
    };




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
                onClick={abrirModalCriacao} 
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

                            <button className='categoria-deletebutton'
                                onClick={() => handleDeleteCategoria(cat.id)}
                                title="Deletar Categoria"
                            >
                                Excluir
                            </button>

                            <button className='categoria-editarbutton'
                                onClick={() => abrirModalEdicao(cat)} 
                                title="Editar categoria"
                            >
                                Editar
                            </button>
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
                            categoriaParaEditar={categoriaEditando} 
                            onSave={() => {
                                carregarCategoriasETransacoes();
                                setIsModalOpen(false);
                            }}
                            onClose={() => setIsModalOpen(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default CategoriasPage;