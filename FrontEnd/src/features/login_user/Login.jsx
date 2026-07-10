import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

function Login() {
    
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

    try {const response = await fetch('http://localhost:8000/auth/login',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha }),
        });
        if (response.ok){
            const data = await response.json();
            localStorage.setItem('token', data.access_token);
            login(data.access_token);
            alert('Login efetuado com sucesso!')
            window.location.href = "/transacoes";
        } else{
            alert('Falha ao logar. Verfique suas credenciais.')
        }
    } catch (error){
        console.error('Erro ao realizar login:', error);
    }   
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Senha" 
                    value={senha} 
                    onChange={(e) => setSenha(e.target.value)} 
                    required 
                />
                <button type="submit">Entrar</button>
            </form>
        </div>
    );

      
    
};

export default Login;