from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.routers import transacoes, categorias
from fastapi.templating import Jinja2Templates
from app.database import create_db_and_tables



create_db_and_tables()

app = FastAPI()


app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/scripts", StaticFiles(directory="static"), name="scripts")
app.include_router(transacoes.router)
app.include_router(categorias.router)

templates = Jinja2Templates(directory="templates")





# @app.get("/criar_categoria")



        




    
   

