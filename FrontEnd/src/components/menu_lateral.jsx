import { Link, useLocation } from 'react-router-dom';
import { FaExchangeAlt, FaTags, FaChartPie } from 'react-icons/fa';
import './menu_lateral.css';

function menu_lateral() {
    const location = useLocation();
    
    return(
        <aside className="sidebar">
            <div className="sidebar-header">
                <h2><FaChartPie style={{ marginRight: '10px'}}/></h2>
            </div>
            <nav className="sidebar-nav">
                <Link to ="/" className={`nav-link $[location.pathname === '/'? 'active' : ''}`}>
                    <FaExchangeAlt className="nav-icon"/>
                    <span>Resumo</span>
                </Link>
                <Link to ="/" className={`nav-link $[location.pathname === '/'? 'active' : ''}`}>
                    <FaExchangeAlt className="nav-icon"/>
                    <span>Transações</span>
                </Link>
                <Link to="/categorias" className={`nav-link ${location.pathname === '/categorias' ? 'active' : ''}`}>
                    <FaTags className="nav-icon" />
                    <span>Categorias</span>
                </Link>
                 <Link to="/categorias" className={`nav-link ${location.pathname === '/categorias' ? 'active' : ''}`}>
                    <FaTags className="nav-icon" />
                    <span>Configurações</span>
                </Link>
                <Link to="/usuario" className={`nav-link ${location.pathname === '/categorias' ? 'active' : ''}`}>
                    <FaTags className="nav-icon" />
                    <span>Cadastro</span>
                </Link>
            </nav>
        </aside>
    );
}
export default menu_lateral