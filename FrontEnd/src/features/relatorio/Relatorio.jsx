import { useEffect, useState } from "react";
import { PieChart, Pie, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PDFDocumento from './PDF/RelatorioPDF';
import api from '../../services/api';

function Relatorio(){   
    const [dados, setDados] = useState([]);

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

    return(
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
                    <Tooltip />
                 
                    <Bar dataKey="valor" fill="#ff0000" /> 
                </BarChart>
            </ResponsiveContainer>
         
            <PDFDownloadLink document={<PDFDocumento data={dados} />} fileName="relatorio.pdf">
                {({ loading }) => loading ? 'Preparando...' : 'Download PDF'}
            </PDFDownloadLink>
        </div>
        
    )


}


    export default Relatorio;