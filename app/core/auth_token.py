import jwt
from datetime import datetime, timedelta
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer

SECRET_KEY = "chave-secreta"
ALGORITHM = "HS256"
security = HTTPBearer()

def criar_token_acesso(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes = 30)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verificar_token(token: str = Security(security)):
    print(f"TOKEN RECEBIDO: {token.credentials}")
    try:
        payload = jwt.decode(token.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError as e:
        print(f"ERRO DE VALIDAÇÃO: {e}")
        raise HTTPException(status_code=401, detail="Token expirado")
    except jwt.InvalidTokenError as e:
        print(f"ERRO DE VALIDAÇÃO: {e}")
        raise HTTPException(status_code=401, detail="Token inválido")