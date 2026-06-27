import TransacaoTable from './features/transacoes/TransacaoTable';
import CategoriaTable from './features/categorias/CategoriaTable';
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';


function App() {
  return (
    <BrowserRouter>
     
      <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
        <Link to="/" style={{ marginRight: '10px' }}>Transações</Link>
        <Link to="/categorias">Gerenciar Categorias</Link>
      </nav>

     
      <Routes>
        <Route path="/" element={<TransacaoTable />} />
        <Route path="/categorias" element={<CategoriaTable />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;