from fastapi.exceptions import HTTPException
from typing import List
from sqlalchemy.orm import Session
from fastapi import HTTPException
from models.evento_model import EventoModel
from models.inscripcion_model import InscripcionModel

def idDuplicados(obj, lista:List):
        for item in lista:
            if item.id == obj.id :
                raise HTTPException(status_code=409,
                            detail=f"ID Ya activo" )
            
def emailDuplicado(obj, lista:List):
        for item in lista:
            if item.email == obj.email:
                raise HTTPException(status_code=409,
                            detail=f"Email Ya activo" )
            
def validar_cupos_disponibles(db: Session, evento_id: int):
    evento = db.query(EventoModel).filter(EventoModel.id == evento_id).first()
    
    inscripciones_actuales = db.query(InscripcionModel).filter(InscripcionModel.evento_id == evento_id).count()
    
    if inscripciones_actuales >= evento.cupos:
        raise HTTPException(status_code=400, detail="No hay cupos disponibles para este evento")