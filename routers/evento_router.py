from fastapi import APIRouter, File, UploadFile
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from config.database import Session
from models.evento_model import EventoModel
from schemas.evento_schema import EventoSchema
from services.evento_service import EventoService

evento_router = APIRouter()

eventos=[]

@evento_router.get('/eventos', tags=['Eventos'], response_model=dict)
def get_eventos(nombre: str = None, descripcion: str = None):
    db = Session()
    
    # Crear una instancia del servicio de eventos
    event_service = EventoService(db)
    
    # Con descripcion filtramos campos
    if nombre or descripcion:
        result = event_service.buscar_eventos_por_nombre_o_descripcion(nombre, descripcion)
    else:
        result = event_service.get_eventos()
    
    db.close() 
    
    if not result:
        return JSONResponse(status_code=404, content={'message': "No se encontraron eventos"})
    
    return JSONResponse(status_code=200, content=jsonable_encoder(result))

@evento_router.get('/eventos/{id}', tags=['Eventos'], response_model=dict)
def get_evento(id: int) -> EnvironmentError:
    db = Session()
    result = EventoService(db).get_evento(id)
    if not result:
        return JSONResponse(status_code=404, content={'message': "No encontrado"})
    return JSONResponse(status_code=200, content=jsonable_encoder(result))

@evento_router.post('/eventos', tags=['Eventos'], response_model=dict, status_code=201)
def create_evento(evento: EventoSchema) :
    db = Session()    
    EventoService(db).create_evento(evento)
    return JSONResponse(status_code=201, content={"message": "Se ha registrado el evento"})

@evento_router.put('/eventos/{id}', tags=['Eventos'], response_model=dict, status_code=200)
def update_evento(id: int, evento: EventoSchema):
    db = Session()
    result = EventoService(db).get_evento(id)
    if not result:
        return JSONResponse(status_code=404, content={'message': "No encontrado"})
    
    EventoService(db).update_evento(id, evento)
    return JSONResponse(status_code=200, content={"message": "Se ha modificado el evento"})

@evento_router.delete('/evento/{id}', tags=['Eventos'], response_model=dict, status_code=200)
def delete_evento(id: int):
    db = Session()
    result: EventoModel = db.query(EventoModel).filter(EventoModel.id == id).first()
    if not result:
        return JSONResponse(status_code=404, content={'message': "No encontrado"})
    EventoService(db).delete_evento(id)
    return JSONResponse(status_code=200, content={"message": "Se ha eliminado el producto"})

@evento_router.get('/eventos/categoria/{categoria_id}', tags=['Eventos'], response_model=dict)
def get_evento_categoria(categoria_id: int):
    db = Session()
    result = EventoService(db).get_evento_categoria(categoria_id)
    if not result:
        return JSONResponse(status_code=404, content={'message': "No encontrado"})
    return JSONResponse(status_code=200, content=jsonable_encoder(result))

@evento_router.get("/eventos",tags=["Dashboard"],response_model=int)
def get_eventos_cant_eventos():
    db = Session()
    result = EventoService(db).get_eventos_cant_eventos()
    if not result:
        return JSONResponse(status_code=404, content={'message': "No hay eventos"})
    return JSONResponse(status_code=200, content=jsonable_encoder(result))

