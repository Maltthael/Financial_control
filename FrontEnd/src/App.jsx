import TransacaoTable from './features/transacoes/TransacaoTable';
import CategoriaTable from './features/categorias/CategoriaTable';
import CadastroUser from './features/cadastro_user/CadastroForm';
import Relatorio from './features/relatorio/Relatorio'
import Login from './features/login_user/Login';
import Perfil from './features/perfil_usuario/Perfil'
import Menu_lateral from './components/menu_lateral';
import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom';
import './App.css';
import PrivateRoute from './features/login_user/privateroute';
import ForgotPassword from './features/login_user/ForgotPassword';
import RecoverPassword from './features/login_user/RecoverPassword';

function LayoutComMenu(){
  return (
    <div className="app-layout">
      <Menu_lateral />
      <main className="main-content">
        <Outlet/> 
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
   
        <Route element={<LayoutComMenu />}> 
          <Route path="/transacoes" element={<PrivateRoute><TransacaoTable /></PrivateRoute>} />
          <Route path="/relatorio" element={<PrivateRoute><Relatorio /></PrivateRoute>} />
          <Route path="/categorias" element={<PrivateRoute><CategoriaTable/></PrivateRoute>} />   
          <Route path="/perfil" element={<PrivateRoute><Perfil/></PrivateRoute>} />  
        </Route>

        {/* --- ROTAS SEM MENU --- */}
        <Route path="/cadastro" element={<CadastroUser/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/recuperar_senha" element={<ForgotPassword/>}/>
        <Route path="/mudar_senha" element={<RecoverPassword/>}/>
        <Route path="/" element={<Login/>} />    
      </Routes>
    </BrowserRouter>
  );
}

export default App;