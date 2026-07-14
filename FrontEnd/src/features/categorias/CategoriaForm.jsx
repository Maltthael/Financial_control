import { useState } from 'react';
import api from '../../services/api';
function CategoriaForm({ onClose, onSave }) {
    const [nome, setNome] = useState('');
    const [erro, setErro] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro('');

        try {
            
            const response = await api.post('/api/adicionar_categoria', {
                nome: nome.trim()
            });

            if (response.status === 200) { 
                setNome('');
                if (onSave) onSave();
                if (onClose) onClose();
            }
        } catch (err) {
            console.error('Erro ao salvar categoria:', err);
            // O Axios coloca a resposta de erro em err.response
            setErro(err.response?.data?.detail || 'Erro ao conectar ao servidor.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="categoria-form">
            <h3>Nova Categoria</h3>

            {erro && <p style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }}>{erro}</p>}

            <div style={{ marginBottom: '10px' }}>
                <input
                    type="text"
                    placeholder="Nome da categoria"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
                />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit">Registrar</button>
                {onClose && (
                    <button type="button" onClick={onClose} style={{ backgroundColor: '#ccc', color: '#000' }}>
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    );
}

export default CategoriaForm;