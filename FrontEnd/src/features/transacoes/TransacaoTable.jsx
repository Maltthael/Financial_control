import { useEffect, useState } from 'react';
import TransacaoForm from './TransacaoForm';
import api from '../../services/api';
import './TransacaoTableStyle.css';
import './popup.css';

function TransacaoTable() {
    const [transacoes, setTransacoes] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transacaoParaEditar, setTransacaoParaEditar] = useState(null);
    const [filtroTexto, setFiltroTexto] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('');
    const [filtroTipo, setFiltroTipo] = useState('todos');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [transacaoIdParaDeletar, setTransacaoIdParaDeletar] = useState(null);
    const [isAnexoModalOpen, setIsAnexoModalOpen] = useState(false);
    const [transacaoIdParaAnexar, setTransacaoIdParaAnexar] = useState(null);
    const [arquivoSelecionado, setArquivoSelecionado] = useState(null);
    const [dropdownAbertoId, setDropdownAbertoId] = useState(null);

    const toggleDropdown = (id) => {
        setDropdownAbertoId(prevId => prevId === id ? null : id);
    };

    const formatarDataEHora = (dataIsoString) => {
        if (!dataIsoString) return '-';
        const data = new Date(dataIsoString);

        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const iniciarEdicao = (transacao) => {
        setTransacaoParaEditar(transacao)
        setIsModalOpen(true);
    }

    const carregarTransacoes = async () => {
        try {
            const response = await api.get('/api/transacoes');
            setTransacoes(response.data);
        } catch (err) {
            console.error("Erro ao buscar transações:", err);
        }
    };

    const carregarCategorias = async () => {
        try {
            const response = await api.get('/api/categorias');
            setCategorias(response.data);
        } catch (err) {
            console.error("Erro ao buscar categorias:", err);
        }
    };

    const abrirModalDeletar = (id) => {
        setTransacaoIdParaDeletar(id);
        setIsDeleteModalOpen(true);
    };

    const fecharModalDeletar = () => {
        setIsDeleteModalOpen(false);
        setTransacaoIdParaDeletar(null);
    };

    const confirmarDelecao = async () => {
        if (transacaoIdParaDeletar) {
            try {
                await api.delete(`/api/transacoes/${transacaoIdParaDeletar}`);
                carregarTransacoes();
            } catch (err) {
                console.error("Erro ao deletar:", err);
            }
        }
        fecharModalDeletar();
    };

    const salvarEdicao = async (id, dadosEditados) => {
        try {
            await api.put(`/api/transacoes/editar/${id}`, dadosEditados);
            setIsModalOpen(false);
            carregarTransacoes();
        } catch (err) {
            console.error("Erro ao editar:", err);
        }
    };

    const abrirModalAnexo = (id) => {
        setTransacaoIdParaAnexar(id);
        setArquivoSelecionado(null);
        setIsAnexoModalOpen(true);
    };

    const fecharModalAnexo = () => {
        setIsAnexoModalOpen(false);
        setTransacaoIdParaAnexar(null);
        setArquivoSelecionado(null);
    };

    const confirmarAnexo = async () => {
        if (!arquivoSelecionado || !transacaoIdParaAnexar) return;

        const formData = new FormData();
        formData.append('file', arquivoSelecionado);

        try {
            await api.put(`/api/transacoes/anexar/${transacaoIdParaAnexar}`, formData);

            fecharModalAnexo();
            carregarTransacoes();
        } catch (error) {
            console.error('Erro ao anexar comprovante:', error.response?.data || error);
            alert(`Erro ao anexar: ${JSON.stringify(error.response?.data || error.message)}`);
        }
    };

    const visualizarArquivo = (caminhoRelativo) => {
        if (!caminhoRelativo) return;

        const urlCompleta = `http://localhost:8000/${caminhoRelativo}`;
        window.open(urlCompleta, '_blank');
    };

    const removerAnexo = async (id) => {
        if (!window.confirm("Deseja realmente remover o anexo desta transação?")) return;

        try {
            await api.delete(`/api/transacoes/anexo/${id}`);
            setDropdownAbertoId(null);
            await carregarTransacoes();
        } catch (error) {
            console.error("Erro ao remover anexo:", error);
        }
    };


    useEffect(() => {
        carregarTransacoes();
        carregarCategorias();
    }, []);

    const transacoesFiltradas = transacoes.filter((t) => {
        const matchTexto = t.descricao?.toLowerCase().includes(filtroTexto.toLowerCase()) ?? true;
        const matchCategoria = filtroCategoria === '' || String(t.categoria_id) === String(filtroCategoria);
        let matchTipo = true;
        if (filtroTipo === 'receita') {
            matchTipo = t.receita === true || t.receita === 1 || t.receita === 'true';
        } else if (filtroTipo === 'gasto') {
            matchTipo = t.receita === false || t.receita === 0 || t.receita === 'false';
        }
        return matchTexto && matchCategoria && matchTipo;
    });

    return (
        <div className='transacao-body'>
            <button className='transacao-criarbutton' onClick={() => setIsModalOpen(true)}>Nova transação +</button>

            <div className="transacao-filtro">
                <div>
                    <label style={{ display: 'block', fontSize: '12px' }}>Pesquisar por descrição:</label>
                    <input
                        className='transacao-filtro-input'
                        type="text"
                        placeholder="Ex: Supermercado..."
                        value={filtroTexto}
                        onChange={(e) => setFiltroTexto(e.target.value)}
                        style={{ padding: '6px' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '12px' }}>Filtrar por Categoria:</label>
                    <select
                        className='transacao-filtro-input'
                        value={filtroCategoria}
                        onChange={(e) => setFiltroCategoria(e.target.value)}
                        style={{ padding: '6px' }}
                    >
                        <option value="">Todas as categorias</option>
                        {categorias.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.nome}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '12px' }}>Tipo:</label>
                    <select
                        className='transacao-filtro-input'
                        value={filtroTipo}
                        onChange={(e) => setFiltroTipo(e.target.value)}
                        style={{ padding: '6px' }}
                    >
                        <option value="todos">Todos</option>
                        <option value="receita">Receitas</option>
                        <option value="gasto">Gastos</option>
                    </select>
                </div>
            </div>

            {isModalOpen && (
                <TransacaoForm
                    transacao={transacaoParaEditar}
                    onClose={() => {
                        setIsModalOpen(false);
                        setTransacaoParaEditar(null);
                    }}
                    onSave={() => {
                        carregarTransacoes();
                        setIsModalOpen(false);
                    }}
                />
            )}

            {isDeleteModalOpen && (
                <div className="delete-modal-overlay">
                    <div className="delete-modal-content">
                        <h3>Tem certeza?</h3>
                        <p>Você realmente deseja excluir esta transação? Essa ação não pode ser desfeita.</p>

                        <div className="delete-modal-buttons">
                            <button className="delete-btn-cancelar" onClick={fecharModalDeletar}>
                                Cancelar
                            </button>
                            <button className="delete-btn-confirmar" onClick={confirmarDelecao}>
                                Sim, excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isAnexoModalOpen && (
                <div className="delete-modal-overlay">
                    <div className="delete-modal-content">
                        <h3>Anexar Comprovante</h3>
                        <p>Selecione um arquivo (PDF ou imagem) para guardar nesta transação:</p>

                        <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={(e) => setArquivoSelecionado(e.target.files[0])}
                            style={{ margin: '15px 0' }}
                        />

                        <div className="delete-modal-buttons">
                            <button className="delete-btn-cancelar" onClick={fecharModalAnexo}>
                                Cancelar
                            </button>
                            <button
                                className="delete-btn-confirmar"
                                onClick={confirmarAnexo}
                                disabled={!arquivoSelecionado}
                            >
                                Enviar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <table className='transacao-table'>
                <thead className='transacao-cabecalho'>
                    <tr>
                        <th>Descrição</th>
                        <th>Valor</th>
                        <th>Categoria</th>
                        <th>Receita</th>
                        <th>Data e Hora</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody className='transacao-container'>
                    {transacoesFiltradas.length > 0 ? (
                        transacoesFiltradas.map((t) => (
                            <tr key={t.id}>
                                <td>{t.descricao}</td>
                                <td>{t.valor != null ? Number(t.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}</td>
                                <td>{categorias.find(cat => cat.id === t.categoria_id)?.nome || "Sem Categoria"}</td>
                                <td className={t.receita ? 'receita' : 'gasto'}> {t.receita ? "Receita" : "Gasto"}</td>
                                <td>{formatarDataEHora(t.data_criacao)}</td>

                                <td className='transacao-container-button'>
                                    {t.arquivo_anexo ? (
                                        <div className="anexo-dropdown-container">
                                            <button
                                                className='transacao-editbutton'
                                                onClick={() => toggleDropdown(t.id)}
                                            >
                                                📄 Anexo ▾
                                            </button>

                                            {dropdownAbertoId === t.id && (
                                                <div className="anexo-dropdown-menu">
                                                    <button onClick={() => {
                                                        visualizarArquivo(t.arquivo_anexo);
                                                        setDropdownAbertoId(null);
                                                    }}>
                                                         Visualizar
                                                    </button>
                                                    <button onClick={() => {
                                                        abrirModalAnexo(t.id);
                                                        setDropdownAbertoId(null);
                                                    }}>
                                                         Substituir
                                                    </button>
                                                    <button className="danger" onClick={() => removerAnexo(t.id)}>
                                                         Remover
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <button className='transacao-editbutton' onClick={() => abrirModalAnexo(t.id)}>
                                            Anexar arquivo
                                        </button>
                                    )}

                                    <button className='transacao-deletebutton' onClick={() => abrirModalDeletar(t.id)}>Deletar</button>
                                    <button className='transacao-editbutton' onClick={() => iniciarEdicao(t)}>Editar</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center' }}>Nenhuma transação encontrada com esses filtros.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default TransacaoTable;