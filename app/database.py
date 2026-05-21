from sqlmodel import create_engine, SQLModel, Field

sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

engine = create_engine(sqlite_url)

class Transacao(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    descricao: str
    valor: float
    categoria: str
    receita: bool

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)