import { useState } from 'react';
import api from '../../services/api';
import './CategoriaFormStyle.css'

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
            setErro(err.response?.data?.detail || 'Erro ao conectar ao servidor.');
        }
    };

    return (
        <div className="modal-overlay">
            <form onSubmit={handleSubmit} className="categoria-form">
                <h3>Nova Categoria</h3>

                {erro && <p className="categoria-erro">{erro}</p>}

                <div>
                    <input
                        className="categoria-input"
                        type="text"
                        placeholder="Nome da categoria"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />
                </div>

                <div className="categoria-botoes">
                    <button type="submit" className="btn-registrar">Registrar</button>
                    {onClose && (
                        <button type="button" onClick={onClose} className="btn-cancelar">
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default CategoriaForm;