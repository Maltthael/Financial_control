import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
    const token = localStorage.getItem('token');
    
    const isAuthenticated = !!token;
    
    console.log("O token no localStorage é:", token);
    console.log("Usuário autenticado?", isAuthenticated);
    
    return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;