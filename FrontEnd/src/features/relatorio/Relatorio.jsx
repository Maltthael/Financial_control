import { useEffect, useState } from "react";
import { PieChart, Pie, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from 'recharts';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PDFDocumento from './PDF/RelatorioPDF';
import api from '../../services/api';

function Relatorio() {
    const [dados, setDados] = useState([]);
    const getCorBarra = (nome, valor) => {
        if (nome === 'Saldo') return valor >= 0 ? '#0000FF' : '#FF0000';
        if (nome === 'Despesas') return '#FF0000';
        return '#2bff00';
    };

    useEffect(() => {
        api.get('/api/relatorios/relatorio')
            .then(res => setDados(res.data))
            .catch(err => console.error("Erro ao buscar relatório:", err));


    }, []);
    if (!dados) return <p>Carregando dados...</p>;
    const dadosGrafico = [
        { name: 'Receitas', valor: dados['total de receita'] },
        { name: 'Despesas', valor: dados['total de despesas'] },
        { name: 'Saldo', valor: dados['saldo total'] }
    ];

    return (
        <div>
            {/* Grafico pizza*/}

            <h1>Relatório Financeiro</h1>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie data={dadosGrafico} dataKey="valor" nameKey="name" fill="#8884d8" />
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>

            {/* Grafico em torre*/}

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dadosGrafico}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                        formatter={(value) =>
                            value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                        }
                    />

                    <Bar dataKey="valor">
                        {dadosGrafico.map((entry, index) => (
                            <Cell 
                                key = {'cell-${index}'}
                                fill = {getCorBarra(entry.name, entry.valor)} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

            <PDFDownloadLink document={<PDFDocumento data={dados} />} fileName="relatorio.pdf">
                {({ loading }) => loading ? 'Preparando...' : 'Download PDF'}
            </PDFDownloadLink>
        </div>

    )


}


export default Relatorio;