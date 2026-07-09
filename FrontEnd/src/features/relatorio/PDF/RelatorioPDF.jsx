import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { styles } from './styles';

const RelatorioPDF = ({ dados }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.header}>Relatório Financeiro</Text>

            <View style={styles.section}>
                <Text style={styles.text}>
                    Total de Receitas: R$ {dados?.['total de receita']?.toFixed(2) || '0.00'}
                </Text>
                <Text style={styles.text}>
                    Total de Despesas: R$ {dados?.['total de despesas']?.toFixed(2) || '0.00'}
                </Text>
                <Text style={styles.text}>
                    Saldo Total: R$ {dados?.['saldo total']?.toFixed(2) || '0.00'}
                </Text>
            </View>
        </Page>
    </Document>
);

export default RelatorioPDF;