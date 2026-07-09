import { useEffect, useState } from "react";
import { PieChart, Pie, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PDFDocumento from './PDF/RelatorioPDF';

function Relatorio(){   
    const [dados, setDados] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/api/relatorios/relatorio')  
            .then(res => res.json())
            .then(data => setDados(data));
            
    
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