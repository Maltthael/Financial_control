import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Cadastro.css';
import './popup.css'; 

function CadastroUser() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();

    const [popup, setPopup] = useState({ show: false, message: '', type: '' });

    const showPopup = (message, type) => {
        setPopup({ show: true, message, type });
        
        if (type === 'error') {
            setTimeout(() => {
                setPopup({ show: false, message: '', type: '' });
            }, 3000);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const usuario = { nome, email, senha };

        try {
            const response = await fetch('http://localhost:8000/auth/cadastro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(usuario),
            });

            if (response.ok) {
                showPopup('Usuário criado com sucesso!', 'success');
                
                setTimeout(() => {
                    navigate('/login');
                }, 1500);
            } else {
                showPopup('Erro ao cadastrar. Tente novamente.', 'error');
            }
        } catch (error) {
            console.error('Erro na conexão:', error);
            showPopup('Erro de conexão com o servidor.', 'error');
        }
    };

    return (
        <div className='cadastro-body'>
            
           
            {popup.show && (
                <div className={`popup-container popup-${popup.type}`}>
                    <span className="popup-icon">
                        {popup.type === 'success' ? '✅' : '❌'}
                    </span>
                    <span>{popup.message}</span>
                </div>
            )}

            <div className='cadastro-content'>
                <div className='cadastro-content2'>

                </div>
                <div>

                </div>
            </div>
            
            <div className='cadastro-container'>
                <form onSubmit={handleSubmit} className='cadastro-form'>
                    <h2 className='cadastro-titulo'>Cadastro de Usuário</h2>
                    <input className='cadastro-input' type="text" placeholder='Nome' value={nome} onChange={(e) => setNome(e.target.value)} required />
                    <input className='cadastro-input' type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input className='cadastro-input' type="password" placeholder='Senha' value={senha} onChange={(e) => setSenha(e.target.value)} required />
                    <button className='cadastro-button' type='submit'>Cadastrar</button>
                    <br />
                    <Link className='cadastro-link' to="/login">Já possui uma conta?</Link>
                </form>
            </div>
        </div>
    );
}

export default CadastroUser;