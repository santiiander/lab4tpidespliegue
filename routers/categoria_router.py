from typing import List
from fastapi import APIRouter
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from config.database import Session
from models.categoria_model import CategoriaModel
from schemas.categoria_schema import CategoriaSchema
from services.categoria_service import CategoriaService


categoria_router = APIRouter()

@categoria_router.get('/categorias', tags=['Categorias'], response_model=List[CategoriaSchema], status_code=200)
def get_categorias():
    db = Session()
    result = CategoriaService(db).get_categorias()
    return JSONResponse(status_code=200, content=jsonable_encoder(result))

@categoria_router.get('/categorias/{id}', tags=['Categorias'], response_model=dict)
def get_categoria(id: int):
    db = Session()
    result = CategoriaService(db).get_categoria(id)
    if not result:
        return JSONResponse(status_code=404, content={'message': "No encontrado"})
    return JSONResponse(status_code=200, content=jsonable_encoder(result))


@categoria_router.post('/categorias', tags=['Categorias'], response_model=dict, status_code=201)
def create_categoria(categoria: CategoriaSchema):
    db = Session()    
    CategoriaService(db).create_categoria(categoria)
    return JSONResponse(status_code=201, content={"message": "Se ha registrado la categoria"})


@categoria_router.put('/categorias/{id}', tags=['Categorias'], response_model=dict, status_code=200)
def update_categoria(id: int, categoria: CategoriaSchema):
    db = Session()
    result = CategoriaService(db).get_categoria(id)
    if not result:
        return JSONResponse(status_code=404, content={'message': "No encontrado"})
    
    CategoriaService(db).update_categoria(id, categoria)
    return JSONResponse(status_code=200, content={"message": "Se ha modificado la categoria"})

@categoria_router.delete('/categorias/{id}', tags=['Categorias'], response_model=dict, status_code=200)
def delete_categoria(id: int):
    db = Session()
    result: CategoriaModel = db.query(CategoriaModel).filter(CategoriaModel.id == id).first()
    if not result:
        return JSONResponse(status_code=404, content={'message': "No encontrado"})
    CategoriaService(db).delete_categoria(id)
    return JSONResponse(status_code=200, content={"message": "Se ha eliminado la categoria"})
