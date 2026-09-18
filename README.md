# 💰 Controle Financeiro
<p align="left">
  <a href="./README.md">Português</a> | <a href="./README.en.MD"><b>English</b></a>
</p>
Uma aplicação para gestão de finanças pessoais, controle de entradas, saídas e acompanhamento de saldo em tempo real.

## 📌 Funcionalidades

* **Registrar Transações:** Cadastro de receitas e despesas com descrição, valor e anexo de arquivos em cada transação.
* **Categorização:** Organização de gastos por categorias (ex: *Alimentação*, *Transporte*, *Lazer*).
* **Segurança:** Autenticação de dois fatores (2FA) e redefinição de senha.
* **Resumo Financeiro:** Visualização do saldo atual e histórico completo de movimentações.

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React** (com JSX)
- **JavaScript (ES6+)**
- **CSS3**

### Backend
- **Python 3.x**
- **FastAPI**
- **SQLite**

## 📁 Estrutura do Projeto

```text
Financial_control/
├── src/
│   └── app/
│       ├── routers/
│       ├── uploads/
│       ├── database.py
│       ├── main.py
│       ├── schemas.py
│       └── utils.py
├── FrontEnd/
├── .gitignore
├── README.md
└── requirements.txt
```
 1. Clone o repositório
```
git clone [https://github.com/seu-usuario/controle-financeiro.git](https://github.com/seu-usuario/controle-financeiro.git)
```
 2. Acesse a pasta do projeto
```
cd Financial_control
```
 3. Instale as dependências do Python
```
pip install -r requirements.txt
```
 4. Inicie o servidor FastAPI
```
uvicorn src.app.main:app --reload
```
# Abra um segundo terminal

5. Instale as dependências do REACT
```
npm install
```
6. Inicie o REACT
```
npm run dev
```

🌐 Acesso Local
Com os dois terminais rodando:

Frontend: http://localhost:5173

Backend / Documentação API: http://127.0.0.1:8000/docs
