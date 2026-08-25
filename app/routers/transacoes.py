from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.database import Transacao, get_session
from app.core.auth_token import verificar_token
from pydantic import BaseModel

router = APIRouter()

class TransacaoCreate(BaseModel):
    descricao: str
    valor: float
    receita: bool
    categoria_id: int

@router.post("/api/transacoes")
def criar_transacao(
    data: TransacaoCreate, 
    session: Session = Depends(get_session), 
    token_data: dict = Depends(verificar_token)
):
    user_id = int(token_data["sub"])
    
    nova_transacao = Transacao(
        **data.model_dump(),
        user_id = user_id
    )
    session.add(nova_transacao)
    session.commit()
    session.refresh(nova_transacao)
    return nova_transacao


@router.get("/api/transacoes")
def listar_transacoes(
    session: Session = Depends(get_session), 
    token_data: dict = Depends(verificar_token)
):
    user_id = int(token_data["sub"])
    statement = select(Transacao).where(Transacao.user_id == user_id)
    transacoes = session.exec(statement).all()
    return transacoes


@router.get("/exibir_receitas")
def exibir_receitas(
    session: Session = Depends(get_session), 
    token_data: dict = Depends(verificar_token)
):
    user_id = int(token_data["sub"])
    statement = select(Transacao).where(Transacao.user_id == user_id, Transacao.receita == True)
    receitas = session.exec(statement).all()
    return receitas


@router.get("/exibir_gastos")
def exibir_gastos(
    session: Session = Depends(get_session), 
    token_data: dict = Depends(verificar_token)
):
    user_id = int(token_data["sub"])
    statement = select(Transacao).where(Transacao.user_id == user_id, Transacao.receita == False)
    gastos = session.exec(statement).all()
    return gastos


@router.put("/api/transacoes/editar/{transacao_id}")
def editar_transacao(
    transacao_id: int, 
    data: TransacaoCreate, 
    session: Session = Depends(get_session), 
    token_data: dict = Depends(verificar_token)
):
    user_id = int(token_data["sub"])
    statement = select(Transacao).where(
        Transacao.id == transacao_id, 
        Transacao.user_id == user_id
    )
    transacao = session.exec(statement).first()
    
    if not transacao:
        raise HTTPException(status_code=404, detail="Transação não encontrada")
        
    transacao.descricao = data.descricao
    transacao.valor = data.valor
    transacao.receita = data.receita
    transacao.categoria_id = data.categoria_id
    
    session.add(transacao)
    session.commit()
    session.refresh(transacao)
    
    return {"status": "success", "message": "Edição salva com sucesso!"}


@router.delete("/api/transacoes/{transacao_id}")
def deletar_transacao(
    transacao_id: int, 
    session: Session = Depends(get_session), 
    token_data: dict = Depends(verificar_token)
):
    user_id = int(token_data["sub"])
    statement = select(Transacao).where(
        Transacao.id == transacao_id, 
        Transacao.user_id == user_id
    )
    transacao = session.exec(statement).first()
    
    if not transacao:
        raise HTTPException(status_code=404, detail="Transação não encontrada")
        
    session.delete(transacao)
    session.commit()
    return {"status": "ok"}