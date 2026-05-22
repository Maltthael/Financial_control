const modal  = document.getElementById('modalTransacao');
const btnAbrir = document.getElementById('btnAbrir');
const btnFechar = document.getElementById('btnFechar');
const btnCancelar = document.getElementById('btnCancelar');


btnAbrir.addEventListener('click', () =>{
    modal.style.display = 'block';
});

btnCancelar.addEventListener('click', () =>{
    modal.style.display = 'none';
});

btnFechar.addEventListener('click', () =>{
    modal.style.display = 'none';
});


document.getElementById('formTransacao').addEventListener('submit', async (e) => {
    e.preventDefault();

const dados = {
    descricao: document.getElementById('descricao').value,
    valor: parseFloat(document.getElementById('valor').value),
    receita: document.getElementById('receita').checked,
    categoria_id: document.getElementById('categoria_id').value

};


const resposta = await fetch('/adicionar_transacao',{
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(dados)
})

if (resposta.ok){
    alert("Sucesso!")
    modal.style.display = 'none'
    location.reload()
} else{
    const erro = await resposta.json();
    console.error(erro)
    alert("Erro ao salvar:" + JSON.stringify(resultado))
}


})






