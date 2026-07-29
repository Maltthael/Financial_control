from pydantic import BaseModel

class Login2FASchema(BaseModel):
    email: str
    token: str
    
class Disable2FASchema(BaseModel):
    current_password: str