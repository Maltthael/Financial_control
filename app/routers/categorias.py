from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates
from sqlmodel import Session, select
from app.database import engine, Categoria


router = APIRouter()

templates = Jinja2Templates(directory="templates")


@router.get("/categorias")
def categorias(request: Request):
    with Session(engine) as session:
        statement = select(Categoria)
        categorias = session.exec(statement).all()
        
    return templates.TemplateResponse(
        request=request,
        name="categorias.html",
        context={"categoria": categorias} 
    )
     
    
@router.post("/adicionar_categoria")
def criar_categoria(categoria: Categoria):
    with Session(engine) as session:
        session.add(categoria)
        session.commit()
        session.refresh(categoria)
    nome = categoria.nome
    return {"mensagem": f"A categoria {nome} foi registrado!"}
    