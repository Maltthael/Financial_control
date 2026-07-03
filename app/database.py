from sqlmodel import create_engine, SQLModel, Field, Relationship, Session
from typing import List
from pydantic import BaseModel


sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

engine = create_engine(sqlite_url)

def get_session():
    with Session(engine) as session:
        yield session

class Categoria(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    nome: str = Field(index=True, unique=True)
    transacoes: List["Transacao"] = Relationship(back_populates= "categoria")

class LoginRequest(BaseModel):
    email: str
    senha: str


class Transacao(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    descricao: str
    valor: float
    receita: bool
    categoria_id: int | None = Field(default=None, foreign_key="categoria.id")
    categoria: Categoria | None = Relationship(back_populates="transacoes")

class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    email: str
    nome: str
    senha: str

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)