import { useEffect, useState } from 'react';
import TransacaoForm from './TransacaoForm';
import api from '../../services/api';


function TransacaoTable() {
    const [transacoes, setTransacoes] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transacaoParaEditar, setTransacaoParaEditar] = useState(null);




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


    return (
        <div>
            <h1>Transações</h1>
            <button onClick={() => setIsModalOpen(true)}>Nova transação</button>
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

            <table>
                <thead>
                    <tr>
                        <th>Descrição</th>
                        <th>Valor</th>
                        <th>Categoria</th>
                        <th>Receita</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {transacoes.map((t) => (
                        <tr key={t.id}>
                            <td>{t.descricao}</td>
                            <td>{t.valor != null ? t.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}</td>
                            <td>{categorias.find(cat => cat.id === t.categoria_id)?.nome || "Sem Categoria"}</td>
                            <td className={t.receita ? 'receita' : 'gasto'}> {t.receita ? "Receita" : "Gasto"}</td>
                            <td>
                                <button onClick={() => deletarTransacao(t.id)}>Deletar</button>
                                <button onClick={() => iniciarEdicao(t)}>Editar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TransacaoTable;