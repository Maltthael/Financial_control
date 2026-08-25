import { useEffect, useState } from "react";
import { PieChart, Pie, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from 'recharts';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PDFDocumento from './PDF/RelatorioPDF';
import api from '../../services/api';
import './RelatorioStyle.css'; // <-- Importando o CSS separado

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

    const { resumo_geral, destaques, despesas_por_categoria } = dados;

    const dadosGrafico = [
        { name: 'Receitas', valor: resumo_geral?.total_receitas || dados['total de receita'] || 0 },
        { name: 'Despesas', valor: resumo_geral?.total_despesas || dados['total de despesas'] || 0 },
        { name: 'Saldo', valor: resumo_geral?.saldo_total || dados['saldo total'] || 0 }
    ];

    const listaCategorias = despesas_por_categoria 
        ? Object.entries(despesas_por_categoria).map(([name, valor]) => ({ name, valor }))
        : [];

    return (
        <div className="relatorio-container">
            {/* Cabeçalho */}
            <div className="relatorio-header">
                <div>
                    <h1>Relatório Financeiro</h1>
                    <p>Acompanhe o resumo das receitas, despesas e análise detalhada.</p>
                </div>
                <PDFDownloadLink 
                    document={<PDFDocumento data={dados} />} 
                    fileName="relatorio-financeiro.pdf"
                    className="btn-download"
                >
                    {({ loading }) => loading ? 'Preparando PDF...' : 'Baixar PDF'}
                </PDFDownloadLink>
            </div>

            {/* Grid de Cards de Indicadores Extras */}
            {resumo_geral && (
                <div className="relatorio-cards-extras">
                    <div className="card-extra">
                        <span className="card-extra-label">Taxa de Poupança</span>
                        <h3 className="card-extra-valor poupanca">{resumo_geral.taxa_poupanca_porcentagem}%</h3>
                    </div>
                    {destaques?.maior_receita?.descricao && (
                        <div className="card-extra">
                            <span className="card-extra-label">Maior Receita</span>
                            <h3 className="card-extra-valor receita">
                                {destaques.maior_receita.descricao} ({destaques.maior_receita.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})
                            </h3>
                        </div>
                    )}
                    {destaques?.maior_despesa?.descricao && (
                        <div className="card-extra">
                            <span className="card-extra-label">Maior Despesa</span>
                            <h3 className="card-extra-valor despesa">
                                {destaques.maior_despesa.descricao} ({destaques.maior_despesa.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})
                            </h3>
                        </div>
                    )}
                </div>
            )}

            {/* Grid de Gráficos Principais */}
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

            {/* Seção: Gastos por Categoria com Barras de Progresso */}
            {listaCategorias.length > 0 && (
                <div className="card-grafico categorias-section">
                    <h3>Despesas por Categoria</h3>
                    <div className="categorias-lista-progresso">
                        {listaCategorias.map((cat) => {
                            const totalDespesas = resumo_geral?.total_despesas || 1;
                            const porcentagem = Math.min(100, (cat.valor / totalDespesas) * 100);

                            return (
                                <div key={cat.name} className="categoria-barra-wrapper">
                                    <div className="categoria-barra-info">
                                        <span className="categoria-barra-nome">{cat.name}</span>
                                        <span className="categoria-barra-valor">
                                            {cat.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </span>
                                    </div>
                                    <div className="barra-progresso-fundo">
                                        <div className="barra-progresso-preenchido" style={{ width: `${porcentagem}%` }}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Relatorio;