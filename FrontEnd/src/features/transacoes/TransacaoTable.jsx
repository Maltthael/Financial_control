import { useEffect, useState } from 'react';
import TransacaoForm from './TransacaoForm';
import api from '../../services/api';
import './TransacaoTableStyle.css';


function TransacaoTable() {
    const [transacoes, setTransacoes] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transacaoParaEditar, setTransacaoParaEditar] = useState(null);
    const [filtroTexto, setFiltroTexto] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('');
    const [filtroTipo, setFiltroTipo] = useState('todos');

    

    



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

    const deletarTransacao = async (id) => {
        if (window.confirm("Tem certeza que deseja deletar?")) {
            try {
                await api.delete(`/api/transacoes/${id}`);
                carregarTransacoes();
            } catch (err) {
                console.error("Erro ao deletar:", err);
            }
        }
    };

    const salvarEdição = async (id, dadosEditados) => {
        try {
            await api.put(`/api/transacoes/editar/${id}`, dadosEditados);
            setIsModalOpen(false);
            carregarTransacoes();
        } catch (err) {
            console.error("Erro ao editar:", err);
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

            <div className="transacao-filtro" >
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

            <table className='transacao-table'>
                <thead className='transacao-cabecalho'>
                    <tr >
                        <th>Descrição</th>
                        <th>Valor</th>
                        <th>Categoria</th>
                        <th>Receita</th>
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
                                <td className='transacao-container-button'>
                                    <button className='transacao-deletebutton' onClick={() => deletarTransacao(t.id)}>Deletar</button>
                                    <button className='transacao-editbutton'onClick={() => iniciarEdicao(t)}>Editar</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center' }}>Nenhuma transação encontrada com esses filtros.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );

}
export default TransacaoTable;