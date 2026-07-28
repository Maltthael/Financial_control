from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
from pydantic import BaseModel, EmailStr
from typing import Optional
import pyotp
import time
import qrcode
import io
import base64
from app.database import User, get_session
from app.core.security import get_current_user
from app.core.auth_token import criar_token_acesso

router = APIRouter(prefix='/perfil', tags=["Perfil e 2FA"])

class UserUpdateSchema(BaseModel):
    nome: Optional[str] = None
    email: Optional[EmailStr] = None
    
class Verify2FASchema(BaseModel):
    token: str
    
    
@router.get("/")
def ver_perfil(current_user: User = Depends(get_current_user)):
    return{
        "id": current_user.id,
        "nome": current_user.nome,
        "email": current_user.email,
        "is_2fa_enabled": current_user.is_2fa_enabled
    }
    
@router.put("/")
def atualizar_perfil(dados: UserUpdateSchema, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    if dados.nome:
        current_user.nome = dados.nome
        
    if dados.email and dados.email != current_user.email:
        existing = session.exec(select(User).where(User.email == dados.email)).first()
        if existing:
            raise HTTPException(status_code = 400, detail = "Este e-mail já está em uso.") 
        current_user.email = dados.email
        
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    
    return {"message": "Perfil atualizado com sucesso !", "nome": current_user.nome, "email": current_user.email}


@router.post("/setup-2fa")
def setup_2fa(session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    secret = pyotp.random_base32()
    current_user.secret_2fa = secret
    
    session.add(current_user)
    session.commit()
    totp_uri = pyotp.totp.TOTP(secret).provisioning_uri(
        name=current_user.email,
        issuer_name = "Controle_financeiro"
    )
    
    img = qrcode.make(totp_uri)
    buffered = io.BytesIO()
    img.save(buffered, format = "PNG")
    qr_code_base64 = base64.b64encode(buffered.getvalue()).decode("utf-8")
    
    return{
        "secret": secret,
        "qr_code_base64": f"data:image/png;base64,{qr_code_base64}"
    }
    
@router.post("/verify-setup-2fa")
def verify_setup_2fa(data: Verify2FASchema, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    if not current_user.secret_2fa:
        raise HTTPException(status_code=400, detail="Configuração de 2FA não iniciada")
    
    totp = pyotp.TOTP(current_user.secret_2fa)
    
    # --- TESTE DE DIAGNÓSTICO ---
    print(f"--- DIAGNÓSTICO 2FA ---")
    print(f"Horário atual do PC/Servidor (Epoch): {time.time()}")
    print(f"Código que o PC acha que é o certo AGORA: {totp.now()}")
    print(f"Código que você digitou no front: {data.token}")
    print(f"------------------------")
    # ---------------------------
    
    if totp.verify(data.token):
        current_user.is_2fa_enabled = True
        session.add(current_user)
        session.commit()
        return {"message": "2FA ativado com sucesso !"}
        
    raise HTTPException(status_code=400, detail="Código invalido. Tente novamente.")