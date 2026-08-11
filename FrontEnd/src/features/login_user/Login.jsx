import { useAuth } from './AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import './login.css';

function Login() {

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [codigo2FA, setCodigo2FA] = useState('');
    const [precisa2FA, setPrecisa2FA] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            if (!precisa2FA) {
                const response = await fetch('http://localhost:8000/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, senha }),
                });

                if (response.ok) {
                    const data = await response.json();

                    if (data.require_2fa) {
                        setPrecisa2FA(true);
                        return;
                    }

                    localStorage.setItem('token', data.access_token);
                    login(data.access_token);
                    alert('Login efetuado com sucesso!');
                    window.location.href = "/transacoes";
                } else {
                    alert('Falha ao logar. Verifique suas credenciais.');
                }
            } else {
                const response = await fetch('http://localhost:8000/auth/login-2fa', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email, token: codigo2FA }),
                });

                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('token', data.access_token);
                    login(data.access_token);
                    alert('Login com 2FA efetuado com sucesso!');
                    window.location.href = "/transacoes";
                } else {
                    alert('Código 2FA inválido ou expirado.');
                }
            }
        } catch (error) {
            console.error('Erro ao realizar login:', error);
        }
    };

    return (



        <div className='login-body'>
            <div className='login-container'>
                <div className='login-content'>
                    <h1 className='login-content-title'>Administre sua vida financeira</h1>
                    <p className='login-content-text'>Conecte-se com a financial control para um dinheiro mais saudavel.</p>
                </div>

            </div>

            <div className='login-container2'>
                <form onSubmit={handleLogin} className='login-form'>
                    <div >
                        {!precisa2FA ? (
                            <>
                                <input className='login-input'
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <input className='login-input'
                                    type="password"
                                    placeholder="Senha"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    required
                                />
                                <button type="submit" className='login-button'>Entrar</button>
                            </>
                        ) : (
                            <>
                             <h1>{precisa2FA ? "Autenticação de Dois Fatores" : "Login"}</h1>
                                <br/>
                                <p>Digite o código de 6 dígitos do seu aplicativo autenticador:</p>
                                <br/>
                                <input className='login-input'
                                    type="text"
                                    maxLength="6"
                                    placeholder="000000"
                                    value={codigo2FA}
                                    onChange={(e) => setCodigo2FA(e.target.value)}
                                    required
                                />
                                <button type="submit" className='login-button'>Verificar Código</button>
                            </>
                        )}
                    </div>

                    <br />
                    <div className='login-container-links'>
                        <Link className='login-links' to="/cadastro"> Não possui uma conta?  </Link>
                        <Link className='login-links' to="/recuperar_senha"> Esqueceu a senha? </Link>
                    </div>


                </form>
            </div>
        </div>
      



    );
};



export default Login;