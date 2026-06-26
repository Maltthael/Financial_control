from fastapi import APIRouter, Depends
from sqlmodel import Session, select, func
from app.database import Transacao, Categoria, get_session


router = APIRouter(prefix="/api/relatorios", tags=["relatorios"])


@router.get("/resumo")
def resumo_mensal(db: Session = Depends(get_session)):
    
    query_receitas = select(func.sum(Transacao.valor)).where(Transacao.receita == True)
    total_receitas = db.exec(query_receitas).one() or 0.0
    query_despesas = select(func.sum(Transacao.valor)).where(Transacao.receita == False)
    total_despesas = db.exec(query_despesas).one() or 0.0
    
    return {"total de receita": total_receitas,
            "total de despesas": total_despesas,
            "saldo total": total_receitas - total_despesas
            }
    