from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from utilss.jwt_manager import create_token
from fastapi.responses import JSONResponse
from schemas.userauth_schema import UsuarioAuth
from config.database import Session
from services.userauth_service import UserAuthService
from passlib.context import CryptContext

userauth_router = APIRouter()

@userauth_router.post('/login', tags=['Auth'])
def login(usuario_a_loguear: UsuarioAuth):
    db = Session()
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    authenticated_user = UserAuthService(db, pwd_context).verify_user_credentials(usuario_a_loguear.email, usuario_a_loguear.password)
    if not authenticated_user:
        raise HTTPException(status_code=401, detail="Correo o contraseña inválidos")
    
    token: str = create_token(usuario_a_loguear.model_dump())
    return JSONResponse(status_code=200, content={"token": token})




    # if user.email == "admin@gmail.com" and user.password == "admin":
    #     token: str = create_token(user.model_dump())
    #     return JSONResponse(status_code=200, content=token)