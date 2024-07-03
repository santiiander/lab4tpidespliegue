from pydantic import BaseModel


class UsuarioAuth(BaseModel):
    email:str
    password:str