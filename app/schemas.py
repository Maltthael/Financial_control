from pydantic import BaseModel, EmailStr

class Login2FASchema(BaseModel):
    email: str
    token: str
    
class Disable2FASchema(BaseModel):
    current_password: str
    token: str
    
    
class Disable2FABackupSchema(BaseModel):
    backup_code: str
    
class RecoverPasswordSchema(BaseModel):
    email: EmailStr


class ResetPasswordSchema(BaseModel):
  token: str
  new_password: str   