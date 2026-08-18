from fastapi import APIRouter, Request, Depends
from fastapi.responses import RedirectResponse
from pydantic import BaseModel

from sqlmodel import Session, select
from app.database import engine, Categoria
from app.core.auth_token import verificar_token

router = APIRouter()


class CategoriaCreate(BaseModel):
    nome: str

    
@router.get("/categorias/deletar/{categoria_id}")
def deletar_categoria(categoria_id: int, token_data: dict = Depends(verificar_token)):
    user_id = int(token_data["sub"])
    with Session(engine) as session:
        statement = select(Categoria).where(
            Categoria.id == categoria_id,
            Categoria.user_id == user_id
        )
        categoria = session.exec(statement).first()
        if categoria:
            session.delete(categoria)
            session.commit()
            
    return {"status": "success", "message": "Categoria deletada com sucesso!"}
        
     
    
@router.post("/api/adicionar_categoria")
def criar_categoria_json(data: CategoriaCreate, token_data: dict = Depends(verificar_token)):
    user_id = int (token_data["sub"])
    with Session(engine) as session:
        nova_categoria = Categoria(nome=data.nome, user_id=user_id)
        session.add(nova_categoria)
        session.commit()
        session.refresh(nova_categoria)
    
    return nova_categoria

@router.get("/api/categorias")
def listar_categorias_json(token_data: dict = Depends(verificar_token)):
    user_id = int(token_data["sub"])
    with Session(engine) as session:
        statement = select(Categoria).where(Categoria.user_id == user_id)
        categorias = session.exec(statement).all()
        return categorias