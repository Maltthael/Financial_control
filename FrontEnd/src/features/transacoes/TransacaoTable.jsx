import { useEffect, useState } from 'react';
import TransacaoForm from './TransacaoForm';

function TransacaoTable(){
    const [transacoes, setTransacoes] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const carregarTransacoes = () => {
        fetch('http://localhost:8000/api/transacoes')
            .then(res => res.json())
            .then(data => {
            console.log("Conteúdo da primeira transação:", data[15]); 
           
            setTransacoes(data);
        })
            .catch(err => console.error("Erro ao buscar:", err));
    };

    const carregarCategorias = () => {
        fetch('http://localhost:8000/api/categorias')
            .then(res => res.json())
            .then(data => {
                setCategorias(data);
            })
            .catch(err => console.error("Erro ao buscar categorias:", err));
    };

    useEffect(() => {
        carregarTransacoes();
        carregarCategorias();
    }, []);


return (
    <div>
        <h1>Transações</h1>
        <button onClick={() => setIsModalOpen(true)}>Nova transação</button>
        {isModalOpen &&(
            <TransacaoForm
                onClose={() => setIsModalOpen(false)}
                onSave={carregarTransacoes}
                />
        )}
    
        <table>
            <thead>
                <tr>
                    <th>Descrição</th>
                    <th>Valor</th>
                    <th>Categoria</th>
                    <th>Receita</th>
                </tr>
            </thead>
            <tbody>
                {transacoes.map((t) => (
                    <tr key ={t.id}>
                        <td>{t.descricao}</td>
                        <td>{t.valor != null ? t.valor.toLocaleString('pt-BR', {style: 'currency', currency:'BRL'}) : 'R$ 0,00'}</td>
                        <td>{categorias.find(cat => cat.id === t.categoria_id)?.nome || "Sem Categoria"}</td>
                        <td className={t.receita ? 'receita' : 'gasto'}> {t.receita ? "Receita" : "Gasto"}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
}

export default TransacaoTable;