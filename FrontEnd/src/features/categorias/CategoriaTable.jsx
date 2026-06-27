import { useEffect, useState } from 'react';
import CategoriaForm from './CategoriaForm';
import './CategoriaStyle.css';
function CategoriasPage() {
    const [categorias, setCategorias] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const carregarCategorias = () => {
        fetch('http://localhost:8000/api/categorias')
            .then(res => res.json())
            .then(data => setCategorias(data))
            .catch(err => console.error("Erro ao carregar categorias:", err));
    };

    useEffect(() => {
        carregarCategorias();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h1>Gerenciar Categorias</h1>
            
       
            <button 
                onClick={() => setIsModalOpen(true)} 
                style={{ marginBottom: '20px', padding: '10px 15px', cursor: 'pointer' }}
            >
                + Nova Categoria
            </button>

            <h3>Categorias Existentes</h3>
            <ul>
                {categorias.map(cat => (
                    <li key={cat.id} style={{ margin: '5px 0' }}>{cat.nome}</li>
                ))}
            </ul>

            
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <CategoriaForm 
                            onSave={carregarCategorias} 
                            onClose={() => setIsModalOpen(false)} 
                        />
                    </div>
                </div>
            )}
        </div>
    );
}



export default CategoriasPage;