import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Cadastro.css';


function CadastroUser() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();

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
                alert('Usuário criado com sucesso!');
            } else {
                alert('Erro ao cadastrar.');
            }
        } catch (error) {
            console.error('Erro na conexão:', error);
        }
    };

    return (
        <div className='cadastro-body'>
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