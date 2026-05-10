from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from sqlmodel import Field, Session, SQLModel, create_engine, select

sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"
engine = create_engine(sqlite_url)

app = FastAPI()

templates = Jinja2Templates(directory="templates")


class Transacao(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True,)
    descricao : str
    valor: float
    categoria: str
    receita: bool
    
SQLModel.metadata.create_all(engine)
    
    

@app.get("/transacoes")
def home(request: Request):
    with Session(engine) as session:
        transacoes = session.exec(select(Transacao)).all()
    return templates.TemplateResponse(
        request=request, 
        name="transacoes.html", 
        context={"transacoes": transacoes}
    )
    

 


@app.post("/adicionar_transação")
def criar_receita(transacao: Transacao):
    with Session(engine) as session:
        session.add(transacao)
        session.commit()
        session.refresh(transacao)
    tipo = "Receita" if transacao.receita else "Gasto"
    return {"mensagem": f"{tipo} de R${transacao.valor} em '{transacao.descricao}' registrado!"}

    
    
@app.get("/exibir_receitas")
def exibir_receitas():
     with Session(engine) as session:
         comando = select(Transacao) .where(Transacao.receita == True)
         receitas = session.exec(comando).all()
     return receitas


@app.get("/exibir_gastos")
def exibir_gastos():
    with Session(engine) as session:
         comando = select(Transacao) .where(Transacao.receita == False)
         gastos = session.exec(comando).all()
    return gastos


@app.get("/calcular_saldo")
def calcular_saldo():
    with Session(engine) as session:
        todas = session.exec(select(Transacao)).all()
        total_receita = sum(t.valor for t in todas if t.receita)
        total_gasto = sum(t.valor for t in todas if not t.receita)
        saldo_final = total_receita - total_gasto
        
    return{
        "total_receita": f"Receita total de R${total_receita}", 
        "total_gasto": f"Gastos totais de R${total_gasto}",
        "saldo_final": f"Saldo final de R${saldo_final}"
    }
    
    
   

