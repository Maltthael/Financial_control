const modal = document.getElementById('modalCategoria');
const btnAbrir = document.getElementById('btnAbrir');
const btnFechar = document.getElementById('btnFechar');
const btnCancelar = document.getElementById('btnCancelar');


btnAbrir.addEventListener('click', () =>{
    modal.style.display = 'block';
})

btnFechar.addEventListener('click', () =>{
    modal.style.display = 'none';
})

btnCancelar.addEventListener('click', () =>{
    modal.style.display = 'none';
})


document.getElementById('formCategoria').addEventListener('submit', async (e) => {
    e.preventDefault();

const dados = {
    nome: document.getElementById('nome').value
};

const resposta = await fetch('/adicionar_categoria',{
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(dados)
});


if (resposta.ok){
    alert("Categoria criada com sucesso!")
    modal.style.display = 'none'
    location.reload()
}else{
    const erro = await resposta.json();
    console.error(erro)
    alert("Erro ao salvar" + JSON.stringify(resultado))
}


})