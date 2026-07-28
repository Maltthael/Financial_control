
import pyotp
from app.database import User, LoginRequest, get_session
from app.core.security import hash_senha, verificar_senha
from sqlmodel import Session, select
from fastapi import APIRouter, HTTPException, Depends, Body
from app.core.auth_token import criar_token_acesso
from app.schemas import Login2FASchema


router = APIRouter(prefix="/auth")


@router.post("/cadastro")
def cadastrar_usuario(usuario: User, session: Session = Depends(get_session)):
    try:
        senha_criptografada = hash_senha(usuario.senha)
        
        novo_usuario = User(
            nome=usuario.nome,
            email=usuario.email,
            senha=senha_criptografada 
        )
        
        session.add(novo_usuario)
        session.commit()
        session.refresh(novo_usuario) 
        
        return {"mensagem": "Usuário criado com sucesso!"}
        
    except Exception as e:
        session.rollback()
        print(f"Erro interno no cadastro: {e}")
        raise HTTPException(status_code=500, detail="Erro interno ao salvar usuário.")

@router.post("/login")
def login(login_data: LoginRequest, session: Session = Depends(get_session)):
    statement = select(User).where(User.email == login_data.email)
    usuario = session.exec(statement).first()
    
    if not usuario or not verificar_senha(login_data.senha, usuario.senha):
        raise HTTPException(
            status_code=401,
            detail="Email ou senha incorretos!"
        )
    
    # Gera o token de acesso para todos, já que o 2FA é opcional no login
    access_token = criar_token_acesso(data={"sub": str(usuario.id)})
    
    return {
        "message": "Login efetuado com sucesso!",
        "access_token": access_token,
        "token_type": "bearer"
    }
    
@router.post("/login-2fa", response_model=None)
def login_2fa(data: Login2FASchema, session: Session = Depends(get_session)):
    statement = select(User).where(User.email == data.email)
    usuario = session.exec(statement).first()
    
    if not usuario or not usuario.is_2fa_enabled or not usuario.secret_2fa:
        raise HTTPException(status_code = 400, detail = "Operação invalida.")   
    
    totp = pyotp.TOTP(usuario.secret_2fa)
    if totp.verify(data.token):
        access_token = criar_token_acesso(data={"sub": str(usuario.id)})
        return {
            "message": "Autenticação de dois fatores bem-sucedida!",
            "access_token": access_token,
            "token_type": "bearer"
        }
    raise HTTPException(status_code=401, detail="Codigo 2FA inválido ou expirado.")