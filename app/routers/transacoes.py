from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlmodel import Session, select
from sqlalchemy.orm import joinedload
from app.database import engine, Transacao, Categoria
from app.core.auth_token import verificar_token


router = APIRouter()


class TransacaoUpdate(BaseModel):
    valor: float
    descricao: str
    receita: bool
    categoria_id: int
    
class TransacaoCreate(BaseModel):
    descricao: str
    valor: float
    receita: bool
    categoria_id: int


    
@router.delete("/api/transacoes/{transacao_id}")
async def deletar_transacao(transacao_id: int, token_data: dict = Depends(verificar_token)):
        user_id = int(token_data["sub"])
        with Session(engine) as session:
            statement = select(Transacao).where(
                Transacao.id == transacao_id,
                Transacao.user_id == user_id
            )
            transacoes = session.exec(statement).first()
            
            if not transacoes:
                raise HTTPException(status_code=404, detail="Transação não encontrada")
            session.delete(transacoes)
            session.commit()
                
        return {"status:" "ok"}
    
@router.put("/api/transacoes/editar/{transacao_id}") 
async def salvar_editar(transacao_id: int, transacao_data: TransacaoUpdate, token_data: dict = Depends(verificar_token)):
    user_id = int(token_data["sub"])
    with Session(engine) as session:
        statement = select(Transacao).where(Transacao.id == transacao_id, Transacao.user_id == user_id)
        transacao = session.exec(statement).first()
        
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
def criar_transacao(data: TransacaoCreate, token_data: dict = Depends(verificar_token)):
    user_id = int(token_data["sub"])
    with Session(engine) as session:
        nova_transacao = Transacao(
            **data.model_dump(),
            user_id = user_id
        )
        session.add(nova_transacao)
        session.commit()
        session.refresh(nova_transacao)
    
    return nova_transacao



@router.get("/exibir_receitas")
def exibir_receitas(token_data: dict = Depends(verificar_token)):
     user_id = int(token_data["sub"])
     with Session(engine) as session:
         comando = select(Transacao) .where(Transacao.receita == True, Transacao.user_id == user_id)
     return session.exec(comando).all()


@router.get("/exibir_gastos")
def exibir_gastos(token_data: dict = Depends(verificar_token)):
    user_id = int(token_data["sub"])
    with Session(engine) as session:
         comando = select(Transacao) .where(Transacao.receita == False, Transacao.user_id == user_id)
    return session.exec(comando).all()



@router.get("/api/transacoes")
def listar_transacoes_json(token_data: dict = Depends(verificar_token)):
    user_id = int(token_data["sub"])
    with Session(engine) as session:
        statement = select(Transacao).where(Transacao.user_id == user_id).options(joinedload(Transacao.categoria))
        transacoes = session.exec(statement).all()
        return transacoes
