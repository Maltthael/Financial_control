from fastapi import APIRouter, Depends
from sqlmodel import Session, select, func
from database import Transacao, Categoria, get_session
from core.auth_token import verificar_token

router = APIRouter(prefix="/api/relatorios", tags=["relatorios"])

@router.get("/relatorio")
def resumo_mensal(session: Session = Depends(get_session), token_data: dict = Depends(verificar_token)):
    user_id = int(token_data["sub"])
    
    # 1. Totais básicos (Receitas e Despesas)
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
    
    saldo_total = total_receitas - total_despesas

  
    maior_despesa_query = session.exec(
        select(Transacao).where(
            Transacao.receita == False, 
            Transacao.user_id == user_id
        ).order_by(Transacao.valor.desc())
    ).first()
    
    maior_receita_query = session.exec(
        select(Transacao).where(
            Transacao.receita == True, 
            Transacao.user_id == user_id
        ).order_by(Transacao.valor.desc())
    ).first()

    # 3. Gastos agrupados por Categoria
    gastos_por_categoria_query = (
        select(Categoria.nome, func.sum(Transacao.valor))
        .join(Transacao, Transacao.categoria_id == Categoria.id)
        .where(Transacao.receita == False, Transacao.user_id == user_id)
        .group_by(Categoria.nome)
    )
    resultado_categorias = session.exec(gastos_por_categoria_query).all()
    
    despesas_por_categoria = {cat_nome: round(total, 2) for cat_nome, total in resultado_categorias}

    # 4. Taxa de Poupança
    taxa_poupanca = 0.0
    if total_receitas > 0:
        taxa_poupanca = round((saldo_total / total_receitas) * 100, 1)

    return {
        "resumo_geral": {
            "total_receitas": round(total_receitas, 2),
            "total_despesas": round(total_despesas, 2),
            "saldo_total": round(saldo_total, 2),
            "taxa_poupanca_porcentagem": taxa_poupanca
        },
        "destaques": {
            "maior_despesa": {
                "descricao": maior_despesa_query.descricao if maior_despesa_query else None,
                "valor": round(maior_despesa_query.valor, 2) if maior_despesa_query else 0.0
            },
            "maior_receita": {
                "descricao": maior_receita_query.descricao if maior_receita_query else None,
                "valor": round(maior_receita_query.valor, 2) if maior_receita_query else 0.0
            }
        },
        "despesas_por_categoria": despesas_por_categoria
    }