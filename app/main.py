import multiprocessing
import uvicorn

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from routers import transacoes, categorias, relatorio, user, user_profile
from fastapi.templating import Jinja2Templates
from database import create_db_and_tables
from fastapi.middleware.cors import CORSMiddleware



create_db_and_tables()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router)
app.include_router(transacoes.router)
app.include_router(categorias.router)
app.include_router(relatorio.router)
app.include_router(user_profile.router)

templates = Jinja2Templates(directory="templates")


if __name__ == "__main__":
    multiprocessing.freeze_support() # Obrigatório para executáveis no Windows
    uvicorn.run(app, host="127.0.0.1", port=8000)



        




    
   

