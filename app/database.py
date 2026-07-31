from sqlmodel import create_engine, SQLModel, Field, Relationship, Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from sqlalchemy import func


sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

engine = create_engine(sqlite_url)

def get_session():
    with Session(engine) as session:
        yield session

class Categoria(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    nome: str = Field(index=True, unique=True)
    user_id: int = Field(foreign_key="user.id")
    user: User = Relationship(back_populates="categorias")
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
    user_id: int = Field(foreign_key="user.id")
    user: User = Relationship(back_populates="transacoes")
    data_criacao: datetime = Field(
        default_factory=datetime.utcnow,
        nullable = False
    )

class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    email: str
    nome: str
    senha: str
    transacoes: List["Transacao"] = Relationship(back_populates="user")
    categorias: List["Categoria"] = Relationship(back_populates="user")
    secret_2fa: Optional[str] = Field(default=None)
    is_2fa_enabled: bool = Field(default=False)
    backup_codes: Optional[str] = None 

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)