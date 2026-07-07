import TransacaoTable from './features/transacoes/TransacaoTable';
import CategoriaTable from './features/categorias/CategoriaTable';
import CadastroUser from './features/cadastro_user/CadastroForm';
import Login from './features/login_user/Login';
import Menu_lateral from './components/menu_lateral';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Menu_lateral/>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<TransacaoTable />} />
            <Route path="/categorias" element={<CategoriaTable />} />
            <Route path="/usuario" element={<CadastroUser/>} />
            <Route path="/login" element={<Login />} />
           

          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;