import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff'
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333333'
  },
  section: {
    margin: 10,
    padding: 10,
    borderBottom: '1px solid #eeeeee'
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
    color: '#555555'
  },
  bold: {
    fontWeight: 'bold',
    color: '#000000'
  }
});