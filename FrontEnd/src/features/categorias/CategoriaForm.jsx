import { useState } from 'react';

function CategoriaForm({ onClose, onSave }) {
    const [nome, setNome] = useState('');
    const [erro, setErro] = useState('');

    // 1. O 'async' fica aqui na declaração da função
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro('');

        if (!nome.trim()) {
            setErro('O nome da categoria não pode estar vazio.');
            return;
        }

        try {
            // 2. O 'await' fica aqui antes do fetch
            // ATENÇÃO: Verifique se a URL abaixo é a correta. Talvez seja /api/adicionar_categoria
            const response = await fetch('http://localhost:8000/api/adicionar_categoria', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ nome: nome.trim() })
            });

            if (response.ok) {
                setNome(''); // Limpa o input
                if (onSave) onSave(); // Atualiza a tabela
                if (onClose) onClose(); // Fecha o modal
            } else {
                const dadosErro = await response.json();
                setErro(dadosErro.detail || 'Erro ao registrar a categoria. Verifique se ela já existe.');
            }
        } catch (err) {
            console.error('Erro ao salvar categoria:', err);
            setErro('Não foi possível conectar ao servidor. Verifique a URL do fetch.');
        }
    };

    return (
        // 3. NUNCA use handleSubmit() com parênteses aqui, apenas a referência!
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