from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.routers import transacoes, categorias, relatorio, user
from fastapi.templating import Jinja2Templates
from app.database import create_db_and_tables
from fastapi.middleware.cors import CORSMiddleware



create_db_and_tables()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router)
app.include_router(transacoes.router)
app.include_router(categorias.router)
app.include_router(relatorio.router)

templates = Jinja2Templates(directory="templates")




        




    
   

