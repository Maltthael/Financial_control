import secrets, string
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session, select
from database import User, get_session
from core.auth_token import SECRET_KEY, ALGORITHM 
from jose import jwt, JWTError
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def hash_senha(senha: str):
    return pwd_context.hash(senha)

def verificar_senha(senha: str, hash_senha: str):
    return pwd_context.verify(senha, hash_senha)

def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    print("TOKEN QUE CHEGOU NO BACKEND:", token)
    credentials_exception = HTTPException(
        status_code = status.HTTP_401_UNAUTHORIZED,
        detail = "Credenciais inválidas ou token expirado.",
        headers = {"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = str = (payload.get("sub"))
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    statement = select(User).where(User.id == int(user_id))
    user = session.exec(statement).first()
    
    if user is None:
        raise credentials_exception
    
    return user
def gerar_codigos_backup(quantidade = 5, tamanho = 8):
    alfabeto = string.ascii_uppercase + string.digits
    codigos = []
    for _ in range(quantidade):
        codigo = "".join(secrets.choice(alfabeto) for _ in range(tamanho))
        codigos.append(codigo)
    return codigos

