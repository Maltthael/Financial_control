import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';


function CadastroUser() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

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
        <form onSubmit={handleSubmit}>
            <h2>Cadastro de Usuário</h2>
            <input type="text" placeholder='Nome' value={nome} onChange={(e) => setNome(e.target.value)} required />
            <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder='Senha' value={senha} onChange={(e) => setSenha(e.target.value)} required />
            <button type='submit'>Cadastrar</button>
            <br/>
            <Link to="/login">Já possui uma conta?</Link>
        </form>
    

    );
}

export default CadastroUser;