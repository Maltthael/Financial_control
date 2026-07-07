from fastapi import APIRouter
from app.database import User, LoginRequest, get_session
from app.core.security import hash_senha, verificar_senha
from sqlmodel import Session, select
from fastapi import APIRouter, HTTPException, Depends
from app.core.auth_token import criar_token_acesso


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
            status_code = 401,
            detail = "Email ou senha incorretos!"
        )
        
    access_token = criar_token_acesso(data={"sub": usuario.id})
    
    return {
        "message": "Login efetuado com sucesso !",
        "access_token": access_token,
        "token_type": "bearer"
    }