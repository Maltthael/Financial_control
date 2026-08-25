import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { styles } from './styles';

const RelatorioPDF = ({ data }) => {
    const resumo = data?.resumo_geral || {};
    
    const totalReceitas = resumo.total_receitas || data?.['total de receita'] || 0;
    const totalDespesas = resumo.total_despesas || data?.['total de despesas'] || 0;
    const saldoTotal = resumo.saldo_total || data?.['saldo total'] || 0;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.header}>Relatório Financeiro</Text>

                <View style={styles.section}>
                    <Text style={styles.text}>
                        Total de Receitas: R$ {Number(totalReceitas).toFixed(2)}
                    </Text>
                    <Text style={styles.text}>
                        Total de Despesas: R$ {Number(totalDespesas).toFixed(2)}
                    </Text>
                    <Text style={styles.text}>
                        Saldo Total: R$ {Number(saldoTotal).toFixed(2)}
                    </Text>
                </View>
            </Page>
        </Document>
    );
};

export default RelatorioPDF;