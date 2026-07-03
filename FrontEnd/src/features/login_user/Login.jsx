import { useAuth } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (response.ok){
            const data = await response.json();
            login(data.acess_token);
            navigate('/dashboard');
        }
        
    };
    
};