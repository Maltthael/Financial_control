import { useEffect, useState } from "react";
import { PieChart, Pie, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from 'recharts';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PDFDocumento from './PDF/RelatorioPDF';
import api from '../../services/api';
import './relatoriostyle.css'; 

function Relatorio() {
    const [dados, setDados] = useState(null); 

    const getCorBarra = (nome, valor) => {
        if (nome === 'Saldo') return valor >= 0 ? '#2563eb' : '#dc2626';
        if (nome === 'Despesas') return '#dc2626';
        return '#16a34a';
    };

    useEffect(() => {
        api.get('/api/relatorios/relatorio')
            .then(res => setDados(res.data))
            .catch(err => console.error("Erro ao buscar relatório:", err));
    }, []);

    if (!dados) {
        return (
            <div className="relatorio-loading">
                <div className="spinner"></div>
                <p>Carregando dados financeiros...</p>
            </div>
        );
    }

    const dadosGrafico = [
        { name: 'Receitas', valor: dados['total de receita'] },
        { name: 'Despesas', valor: dados['total de despesas'] },
        { name: 'Saldo', valor: dados['saldo total'] }
    ];

    return (
        <div className="relatorio-container">
            {/* Cabeçalho */}
            <div className="relatorio-header">
                <div>
                    <h1>Relatório Financeiro</h1>
                    <p>Acompanhe o resumo das receitas, despesas e saldo atual.</p>
                </div>
                <PDFDownloadLink 
                    document={<PDFDocumento data={dados} />} 
                    fileName="relatorio-financeiro.pdf"
                    className="btn-download"
                >
                    {({ loading }) => loading ? 'Preparando PDF...' : ' baixar PDF'}
                </PDFDownloadLink>
            </div>

            {/* Grid de Gráficos */}
            <div className="relatorio-grid">
                {/* Gráfico de Pizza */}
                <div className="card-grafico">
                    <h3>Distribuição Geral</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie 
                                data={dadosGrafico} 
                                dataKey="valor" 
                                nameKey="name" 
                                cx="50%" 
                                cy="50%" 
                                outerRadius={90} 
                                innerRadius={45} 
                                paddingAngle={4}
                                label
                            >
                                {dadosGrafico.map((entry, index) => (
                                    <Cell key={`pie-cell-${index}`} fill={getCorBarra(entry.name, entry.valor)} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Gráfico de Barras */}
                <div className="card-grafico">
                    <h3>Comparativo Financeiro</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={dadosGrafico} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
                            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                            <Tooltip
                                formatter={(value) =>
                                    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                                }
                                cursor={{ fill: 'rgba(226, 232, 240, 0.4)' }}
                            />
                            <Bar dataKey="valor" radius={[6, 6, 0, 0]}>
                                {dadosGrafico.map((entry, index) => (
                                    <Cell 
                                        key={`bar-cell-${index}`}
                                        fill={getCorBarra(entry.name, entry.valor)} 
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default Relatorio;