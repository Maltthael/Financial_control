from fastapi import APIRouter, Request, Form
from fastapi.templating import Jinja2Templates
from fastapi.responses import RedirectResponse
from sqlmodel import Session, select
from sqlalchemy.orm import joinedload
from app.database import engine, Transacao, Categoria


router = APIRouter()

templates = Jinja2Templates(directory="templates")


@router.get("/transacoes")
def listar_transacoes(request: Request):
    with Session(engine) as session:
        statement = select(Transacao).options(joinedload(Transacao.categoria))
        transacoes = session.exec(statement).all()
        categorias = session.exec(select(Categoria)).all()
        total_gasto = sum(t.valor for t in transacoes if not t.receita)
        total_receita = sum(t.valor for t in transacoes if t.receita)
        saldo_final = total_receita - total_gasto
        
    return templates.TemplateResponse(
        request=request,
        name="transacoes.html",
        context={
            "transacoes": transacoes,
            "categorias": categorias,
            "total_gasto": total_gasto,
            "total_receita": total_receita,
            "saldo_final": saldo_final
        }
    )
    
@router.get("/transacoes/deletar/{transacao_id}")
async def deletar_transacao(transacao_id: int):
        with Session(engine) as session:
            transacoes = session.get(Transacao, transacao_id)
            
            if transacoes:
                session.delete(transacoes)
                session.commit()
                
        return RedirectResponse(url="/transacoes", status_code = 303)
    
@router.get("/transacoes/editar/{transacao_id}") 
    
@router.post("/api/transacoes")
def criar_transacao(transacao: Transacao):
    with Session(engine) as session:
        session.add(transacao)
        session.commit()
        session.refresh(transacao)
    
    return transacao



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



@router.get("/api/transacoes")
def listar_transacoes_json():
    with Session(engine) as session:
        statement = select(Transacao).options(joinedload(Transacao.categoria))
        transacoes = session.exec(statement).all()
        # O FastAPI automaticamente converte objetos SQLModel para JSON
        return transacoes