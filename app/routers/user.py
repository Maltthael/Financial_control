
import pyotp, secrets
from datetime import datetime, timedelta
from database import User, LoginRequest, get_session
from core.security import hash_senha, verificar_senha
from sqlmodel import Session, select
from fastapi import APIRouter, HTTPException, Depends, Body
from core.auth_token import criar_token_acesso
from schemas import Login2FASchema, RecoverPasswordSchema, ResetPasswordSchema
from utils import enviar_email_recuperacao
from core.serializer.cadastro_user import CadastroUserSerializer


router = APIRouter(prefix="/auth")


@router.post("/cadastro")
def cadastrar_usuario(usuario: User, session: Session = Depends(get_session)):
    try:
      
        serializer = CadastroUserSerializer(usuario, session)
        usuario_validado = serializer.validar_e_processar()

      
        senha_criptografada = hash_senha(usuario_validado.senha)
        
        novo_usuario = User(
            nome=usuario_validado.nome,
            email=usuario_validado.email,
            senha=senha_criptografada 
        )
        
        session.add(novo_usuario)
        session.commit()
        session.refresh(novo_usuario) 
        
        return {"mensagem": "Usuário criado com sucesso!"}
        
    except HTTPException as he:
        raise he
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
    if getattr(usuario, "is_2fa_enabled", False) and usuario.secret_2fa:
        return {
            "require_2fa": True,
            "message": "Credenciais válidas. Insira o código do 2FA para prosseguir."
        }
        
    if getattr(login_data, "remember_me", False):
        access_token_expires = timedelta(days=7)
    else:
        access_token_expires = timedelta(minutes=30)
    
    
    
    access_token = criar_token_acesso(data={"sub": str(usuario.id)}, expires_delta = access_token_expires)
    
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


@router.post("/password-recover", response_model= None)
def password_recover(data: RecoverPasswordSchema, session: Session = Depends(get_session)):
    statement = select(User).where(User.email == data.email)
    usuario = session.exec(statement).first()
    
    if usuario:
        token = secrets.token_urlsafe(32)
        usuario.reset_token = token
        usuario.reset_token_expires = datetime.utcnow() + timedelta(minutes=15)
        
        session.add(usuario)
        session.commit()
        enviar_email_recuperacao(usuario.email, token)
    
    return {
      "message": (
          "Se o e-mail informado estiver cadastrado, você receberá as"
          " instruções de recuperação em breve."
      )
    }
    
@router.post("/reset-password")
def reset_password(
    data: ResetPasswordSchema, session: Session = Depends(get_session)
):
  statement = select(User).where(User.reset_token == data.token)
  usuario = session.exec(statement).first()

  if not usuario or not usuario.reset_token_expires:
    raise HTTPException(status_code=400, detail="Token inválido ou expirado.")

  if datetime.utcnow() > usuario.reset_token_expires:
    raise HTTPException(
        status_code=400,
        detail=(
            "Este link de recuperação expirou. Solicite um novo"
            " reenvio."
        ),
    )

  usuario.senha = hash_senha(data.new_password)

  usuario.reset_token = None
  usuario.reset_token_expires = None

  session.add(usuario)
  session.commit()

  return {"message": "Senha redefinida com sucesso! Você já pode fazer login."}