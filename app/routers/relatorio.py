from fastapi import APIRouter, Depends
from sqlmodel import Session, select, func
from app.database import Transacao, Categoria, get_session
from app.core.auth_token import verificar_token


router = APIRouter(prefix="/api/relatorios", tags=["relatorios"])


@router.get("/relatorio")
def resumo_mensal(session: Session = Depends(get_session), token_data: dict = Depends(verificar_token)):
    
    user_id = int(token_data["sub"])
    
    query_receitas = select(func.sum(Transacao.valor)).where(
        Transacao.receita == True,
        Transacao.user_id == user_id
        )
    total_receitas = session.exec(query_receitas).one() or 0.0
    
    query_despesas = select(func.sum(Transacao.valor)).where(
        Transacao.receita == False, 
        Transacao.user_id == user_id
        )
    total_despesas = session.exec(query_despesas).one() or 0.0
    
    return {"total de receita": round(total_receitas),
            "total de despesas": round(total_despesas),
            "saldo total": round(total_receitas - total_despesas)
            }
    