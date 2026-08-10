from sqlmodel import Session, select
from fastapi import HTTPException
from app.database import User

class CadastroUserSerializer:
    def __init__(self, usuario_data: User, session: Session):
        self.usuario_data = usuario_data
        self.session = session

    def validar_e_processar(self):
        statement = select(User).where(User.email == self.usuario_data.email)
        usuario_existente = self.session.exec(statement).first()

        if usuario_existente:
           
            raise HTTPException(
                status_code=400, 
                detail="Erro: Este e-mail já está cadastrado."
            )
        
        
        return self.usuario_data