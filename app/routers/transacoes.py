from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates
from sqlmodel import Field, Session, SQLModel, create_engine, select
from app.database import engine, Transacao


router = APIRouter()

templates = Jinja2Templates(directory="templates")

    
    
    
@router.get("/transacoes")
def home(request: Request):
    with Session(engine) as session:
        transacoes = session.exec(select(Transacao)).all()
        todas = session.exec(select(Transacao)).all()
        total_receita = sum(t.valor for t in todas if t.receita)
        total_gasto = sum(t.valor for t in todas if not t.receita)
        saldo_final = total_receita - total_gasto
    return templates.TemplateResponse(
        request=request, 
        name="transacoes.html", 
        context={"transacoes": transacoes,
                 "total_receita":total_receita,
                 "total_gasto":total_gasto,
                 "saldo_final":saldo_final
                 }
       
    )
    
    
    
@router.post("/adicionar_transacao")
def criar_receita(transacao: Transacao):
    with Session(engine) as session:
        session.add(transacao)
        session.commit()
        session.refresh(transacao)
    tipo = "Receita" if transacao.receita else "Gasto"
    return {"mensagem": f"{tipo} de R${transacao.valor} em '{transacao.descricao}' registrado!"}



@router.get("/exibir_receitas")
def exibir_receitas():
     with Session(engine) as session:
         comando = select(Transacao) .where(Transacao.receita == True)
         receitas = session.exec(comando).all()
     return receitas


@router.get("/exibir_gastos")
def exibir_gastos():
    with Session(engine) as session:
         comando = select(Transacao) .where(Transacao.receita == False)
         gastos = session.exec(comando).all()
    return gastos