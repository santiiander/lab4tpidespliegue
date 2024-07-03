from fastapi import APIRouter
from typing import List
from schemas.usuario_schema import UsuarioBaseSchema
from schemas.usuario_schema import UsuarioSchema
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from config.database import Session
from models.usuario_model import UsuarioModel
from services.usuario_service import UsuarioService
from passlib.context import CryptContext

usuario_router = APIRouter()

@usuario_router.get('/usuarios', tags=['Usuarios'], response_model=List[UsuarioBaseSchema], status_code=200)
def get_usuarios():
    db = Session()
    result = UsuarioService(db).get_usuarios()
    # return JSONResponse(status_code=200, content=jsonable_encoder(result))
    return result


@usuario_router.get('/usuarios/{id}', tags=['Usuarios'], response_model=UsuarioBaseSchema)
def get_usuario(id: int):
    db = Session()
    result = UsuarioService(db).get_usuario(id)
    if not result:
        return JSONResponse(status_code=404, content={'message': "No encontrado"})
    # return JSONResponse(status_code=200, content=jsonable_encoder(result))
    return result

@usuario_router.post('/usuarios', tags=['Usuarios'], status_code=201, response_model=UsuarioBaseSchema)
def create_usuario(usuario: UsuarioSchema) :
    db = Session()
    result = UsuarioService(db).create_usuario(usuario)
    # return JSONResponse(status_code=201, content={"message": "Se ha registrado el usuario"})
    return result

@usuario_router.put('/usuarios/{id}', tags=['Usuarios'], response_model=UsuarioBaseSchema, status_code=200)
def update_usuario(id: int, usuario: UsuarioSchema):
    db = Session()
    query = UsuarioService(db).get_usuario(id)
    if not query:
        return JSONResponse(status_code=404, content={'message': "Usuario no encontrado"})    
    result = UsuarioService(db).update_usuario(id, usuario)
    # return JSONResponse(status_code=200, content={"message": "Se ha modificado el usuario"})
    return result

@usuario_router.delete('/usuarios/{id}', tags=['Usuarios'], response_model=UsuarioBaseSchema, status_code=200)
def delete_usuario(id: int):
    db = Session()
    query: UsuarioModel = db.query(UsuarioModel).filter(UsuarioModel.id == id).first()
    if not query:
        return JSONResponse(status_code=404, content={'message': "No encontrado"})
    result = UsuarioService(db).delete_usuario(id)
    # return JSONResponse(status_code=200, content={"message": "Se ha eliminado el usuario"})
    return result
