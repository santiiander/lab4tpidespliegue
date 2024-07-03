import shutil
from fastapi import File, UploadFile
from fastapi.responses import FileResponse
from models.evento_model import EventoModel
from schemas.evento_schema import EventoSchema
from services.categoria_service import CategoriaService
from utilss.validators import idDuplicados


class EventoService():
    
    def __init__(self, db) -> None:
        self.db = db

    def get_eventos(self):
        result = self.db.query(EventoModel).all()
        return result
    
    def get_evento(self, id):
        result = self.db.query(EventoModel).filter(EventoModel.id == id).first()
        return result
    
    def create_evento(self, evento: EventoSchema):
        # Verificar si la categoría existe antes de crear el evento
        categoria_service = CategoriaService(self.db)
        categoria_existente = categoria_service.get_categoria(evento.categoria_id)
        
        if not categoria_existente:
            # Manejar la situación donde la categoría no existe
            raise ValueError("La categoría especificada no existe")
        
        lista = self.get_eventos()
        idDuplicados(evento, lista)
        new_evento = EventoModel(**evento.model_dump())
        self.db.add(new_evento)
        self.db.commit()
        return new_evento
    
    def update_evento(self, id: int, evento: EventoSchema):
        result = self.db.query(EventoModel).filter(EventoModel.id == id).first()
        result.nombre = evento.nombre
        result.descripcion = evento.descripcion
        result.fecha_inicio = evento.fecha_inicio
        result.fecha_fin = evento.fecha_fin
        result.lugar=evento.lugar
        result.cupos=evento.cupos
        result.categoria_id=evento.categoria_id
        self.db.commit()
        return result
    
    def delete_evento(self, id:int):
        self.db.query(EventoModel).filter(EventoModel.id == id).delete()
        self.db.commit()
        return True
    
    def get_evento_categoria(self, categoria_id: int):
        result = self.db.query(EventoModel).filter(EventoModel.categoria_id == categoria_id).all()
        return result
    
    def buscar_eventos_por_nombre_o_descripcion(self, nombre: str = None, descripcion: str = None):
        query = self.db.query(EventoModel)
        
        # Filtrar por nombre si se proporciona
        if nombre:
            query = query.filter(EventoModel.nombre.ilike(f"%{nombre}%"))
        
        # Filtrar por descripción si se proporciona
        if descripcion:
            query = query.filter(EventoModel.descripcion.ilike(f"%{descripcion}%"))
        
        return query.all()

    def get_eventos_cant_eventos(self,cantidad):
        try:
            result = self.db.query(EventoModel).count()
            return result
        except Exception as e:
            print(f"Error en get_eventos_cant_eventos: {e}")
            return None