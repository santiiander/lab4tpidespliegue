from pydantic import BaseModel, Field
from datetime import date


class EventoSchema(BaseModel):
    id: int = Field(gt=0)
    nombre: str = Field(min_length=1, max_length=35)
    descripcion: str= Field(min_lenght=1, max_length=160)
    fecha_inicio: date 
    fecha_fin: date
    lugar: str
    cupos: int
    categoria_id:int