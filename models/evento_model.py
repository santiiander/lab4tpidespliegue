from sqlalchemy import Column, Date, Integer, String, ForeignKey
from config.database import Base

class EventoModel(Base):
    __tablename__ = "eventos"

    id = Column(Integer, primary_key=True)
    nombre = Column(String(30))
    descripcion = Column(String(160))
    fecha_inicio = Column(Date)
    fecha_fin = Column(Date)
    lugar = Column(String(160))
    cupos = Column(Integer)
    categoria_id = Column(Integer, ForeignKey('categorias.id'), nullable=False)
