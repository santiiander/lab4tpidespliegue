from models.inscripcion_model import InscripcionModel
from schemas.inscripcion_schema import InscripcionSchema
from utilss.validators import idDuplicados
from datetime import date
from models.evento_model import EventoModel
from sqlalchemy import func

class InscripcionService():
    def __init__(self, db) -> None:
        self.db = db

    def get_inscripciones(self):
        result = self.db.query(InscripcionModel).all()
        return result
    
    def get_inscripcion(self, id):
        result = self.db.query(InscripcionModel).filter(InscripcionModel.id == id).first()
        return result
    
    def create_inscripcion(self, inscripcion: InscripcionSchema):
        lista = self.get_inscripciones()
        idDuplicados(inscripcion, lista)
        new_inscripcion = InscripcionModel(**inscripcion.model_dump())
        self.db.add(new_inscripcion)
        self.db.commit()
        return new_inscripcion
    
    def update_inscripcion(self, id: int, inscripcion: InscripcionSchema):
        result = self.db.query(InscripcionModel).filter(InscripcionModel.id == id).first()
        result.evento_id = inscripcion.evento_id
        result.usuario_id = inscripcion.usuario_id
        result.fecha_inscripción = inscripcion.fecha_inscripción
        self.db.commit()
        return result
    
    def delete_inscripcion(self, id:int):
        self.db.query(InscripcionModel).filter(InscripcionModel.id == id).delete()
        self.db.commit()
        return True
    
    def get_inscripcion_usuario(self, usuario_id: int):
        result = self.db.query(InscripcionModel).filter(InscripcionModel.usuario_id == usuario_id).all()
        return result
    
    def get_inscripcion_usuario_activa(self, usuario_id: int):
        today = date.today()
        result = self.db.query(InscripcionModel).join(EventoModel, InscripcionModel.evento_id == EventoModel.id).filter(
            InscripcionModel.usuario_id == usuario_id,
            EventoModel.fecha_inicio >= today
        ).all()
        return result
    

    def get_inscr_activ(self):
        today = date.today()
        cantidad_activas = (
            self.db.query(InscripcionModel)
            .join(EventoModel, InscripcionModel.evento_id == EventoModel.id)
            .filter(EventoModel.fecha_inicio >= today)
            .count()
        )
        return cantidad_activas


    def get_promedio_inscripciones_por_evento(self):
        total_inscripciones = self.db.query(func.count(InscripcionModel.id)).scalar()
        total_eventos = self.db.query(func.count(EventoModel.id)).scalar()
        
        if total_eventos == 0:
            promedio_inscripciones = 0
        else:
            promedio_inscripciones = total_inscripciones / total_eventos
        
        return promedio_inscripciones
    
    def get_evento_con_mas_inscripciones(self):
        subquery = (
            self.db.query(
                InscripcionModel.evento_id,
                func.count(InscripcionModel.id).label('num_inscripciones')
            )
            .group_by(InscripcionModel.evento_id)
            .subquery()
        )

        query = (
            self.db.query(EventoModel, subquery.c.num_inscripciones)
            .join(subquery, EventoModel.id == subquery.c.evento_id)
            .order_by(subquery.c.num_inscripciones.desc())
            .first()
        )

        if query:
            evento, num_inscripciones = query
            return {
                "nombre": evento.nombre,
                "descripcion": evento.descripcion,
                "fecha_inicio": evento.fecha_inicio,
                "fecha_fin": evento.fecha_fin,
                "lugar": evento.lugar,
                "num_inscripciones": num_inscripciones
            }
        else:
            return None