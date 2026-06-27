import Button from '../../components/button';

function TransacaoForm({ onClose, onSave}){
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        const payload = {
            descricao: data.descricao,
            valor: parseFloat(data.valor),
            receita: data.receita === 'receita',
            categoria_id: parseInt(data.categoria_id)
        };
        try{
            const response = await fetch('http://localhost:8000/api/transacoes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
        });

        if(response.ok){
            onSave();
            onClose();
        } else {
            alert("Erro ao salvar transacao. Verifique os dados.");
        }
    } catch(err){
        console.error("Erro ao salvar", err);
    }
};

return (
    <form onSubmit={handleSubmit}>
        <input name="descricao" placeholder="Descrição" required />
        <input name="valor" type="number" step="0.01" placeholder="Valor" required />

        <select name="receita" required>
            <option value="false">Gasto</option>
            <option value="true">Receita</option>
        </select>
        <select name="categoria" required>
            <option value="false">Categoria1</option>
            <option value="true">Categoria2</option>
        </select>

        <button type="submit">Criar</button>
        <button type="button" onClick={onClose}>Cancelar</button>
    </form>
);
}
export default TransacaoForm