from datetime import datetime, timedelta
from fastapi import HTTPException, status, Security
from fastapi.security import OAuth2PasswordBearer
import jwt

SECRET_KEY = "chave-secreta"
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def criar_token_acesso(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verificar_token(token: str = Security(oauth2_scheme)):
    print(f"TOKEN RECEBIDO: {token}")
    try:
        # Como o OAuth2PasswordBearer injeta 'token' como uma string pura, 
        # decodificamos diretamente sem usar '.credentials'
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError as e:
        print(f"ERRO DE VALIDAÇÃO: {e}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expirado")
    except jwt.InvalidTokenError as e:
        print(f"ERRO DE VALIDAÇÃO: {e}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")