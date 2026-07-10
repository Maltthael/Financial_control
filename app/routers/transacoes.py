from fastapi import APIRouter, Request, Form, HTTPException
from pydantic import BaseModel
from sqlmodel import Session, select
from sqlalchemy.orm import joinedload
from app.database import engine, Transacao, Categoria


router = APIRouter()


class TransacaoUpdate(BaseModel):
    valor: float
    descricao: str
    receita: bool
    categoria_id: int


    
@router.delete("/api/transacoes/{transacao_id}")
async def deletar_transacao(transacao_id: int):
        with Session(engine) as session:
            transacoes = session.get(Transacao, transacao_id)
            
            if not transacoes:
                raise HTTPException(status_code=404, detail="Transação não encontrada")
            session.delete(transacoes)
            session.commit()
                
        return {"status:" "ok"}
    
@router.put("/api/transacoes/editar/{transacao_id}") 
async def salvar_editar(transacao_id: int, transacao_data: TransacaoUpdate):
    with Session(engine) as session:
        transacao = session.get(Transacao, transacao_id)
        if not transacao:
            raise HTTPException(status_code=404, detail="Transação não encontrada")
        transacao.valor = transacao_data.valor
        transacao.descricao = transacao_data.descricao
        transacao.receita = transacao_data.receita
        transacao.categoria_id = transacao_data.categoria_id
        
        session.commit()
        session.refresh(transacao)
    return {"status": "success", "message": "Edição salva com sucesso!"}
         



    
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
        return transacoes
