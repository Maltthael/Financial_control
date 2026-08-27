import { useState, useEffect } from 'react';
import api from '../../services/api';
import './CategoriaFormStyle.css'

function CategoriaForm({ categoriaParaEditar, onClose, onSave }) {
    const [nome, setNome] = useState('');

    useEffect(() => {
        if (categoriaParaEditar) {
            setNome(categoriaParaEditar.nome);
        } else {
            setNome('');
        }
    }, [categoriaParaEditar]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (categoriaParaEditar) {
                await api.patch(`/categorias/editar/${categoriaParaEditar.id}`, { nome });
            } else {

                await api.post('/api/adicionar_categoria', { nome });
            }

            onSave();
        } catch (err) {
            console.error("Erro ao salvar categoria:", err);
            alert("Erro ao salvar categoria.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>{categoriaParaEditar ? 'Editar Categoria' : 'Nova Categoria'}</h3>

            <div>
                <label>Nome da Categoria:</label>
                <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                />
            </div>

            <div className="modal-buttons">
                <button type="submit">Salvar</button>
                <button type="button" onClick={onClose}>Cancelar</button>
            </div>
        </form>
    );
}

export default CategoriaForm;