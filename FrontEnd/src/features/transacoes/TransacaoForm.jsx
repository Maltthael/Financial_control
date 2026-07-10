import Button from '../../components/button';
import { useEffect, useState} from 'react';

function TransacaoForm({ onClose, onSave, transacao}){
    const [categorias, setCategorias] = useState([]);
    useEffect(() => {
        fetch('http://localhost:8000/api/categorias')
        .then(res => res.json())
        .then(data => setCategorias(data))
        .catch(err => console.error("Erro ao buscar categorias:", err));
    }, []);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        const payload = {
            descricao: data.descricao,
            valor: parseFloat(data.valor),
            receita: data.receita === 'true',
            categoria_id: parseInt(data.categoria_id)
        };

        const url = transacao 
            ? `http://localhost:8000/api/transacoes/editar/${transacao.id}` 
            : 'http://localhost:8000/api/transacoes';
            
        const method = transacao ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                onSave();
                onClose();
            } else {
                alert("Erro ao salvar.");
            }
        } catch (err) {
            console.error("Erro ao salvar", err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
      
            <input name="descricao" defaultValue={transacao?.descricao} placeholder="Descrição" required />
            <input name="valor" type="number" step="0.01" defaultValue={transacao?.valor} placeholder="Valor" required />

            <select name="receita" defaultValue={transacao?.receita}>
                <option value="false">Gasto</option>
                <option value="true">Receita</option>
            </select>
            
            <select name="categoria_id" defaultValue={transacao?.categoria_id} required>
                <option value="">Selecione uma categoria</option>
                {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.nome}</option>
                ))}
            </select>

            <button type="submit">{transacao ? "Salvar Alterações" : "Criar"}</button>
            <button type="button" onClick={onClose}>Cancelar</button>
        </form>
    );
}
export default TransacaoForm