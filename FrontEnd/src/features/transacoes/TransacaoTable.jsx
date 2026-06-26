import { useEffect, useState } from 'react';

function TransacaoTable(){
    const [transacoes, setTransacoes] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/api/transacoes')
        .then(res => res.json())
        .then((data) => {
            console.log("Dados recebidos da API:", data); 
            setTransacoes(data);
        })
        .catch(err => console.error("Erro ao buscar:", err));
    }, []);


return (
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
                    <td>{t.descriocao}</td>
                    <td>{t.valor.toLocaleString('pt-BR', {style: 'currency', currency:'BRL'})}</td>
                    <td>{t.categoria?.nome}</td>
                    <td className={t.receita ? 'receita' : 'gasto'}> {t.receita ? "Receita" : "Gasto"}</td>
                </tr>
            ))}
        </tbody>
    </table>
);
} 
export default TransacaoTable;