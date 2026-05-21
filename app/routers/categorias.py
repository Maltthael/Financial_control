from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates
from sqlmodel import Field, Session, SQLModel, create_engine, select
from app.database import engine, Transacao


router = APIRouter()

templates = Jinja2Templates(directory="templates")


@router.get("/categorias")
def categorias(request: Request):
    with Session(engine) as session:
        categorias = session.exec(select(Transacao)).all()
    return templates.TemplateResponse(
     request=request,
     name="categorias.html",
     context={ "categorias": categorias}
 )
    