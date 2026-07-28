from pydantic import BaseModel

class Login2FASchema(BaseModel):
    email: str
    token: str