from config.database import Base
from sqlalchemy import Column, Integer, Date, ForeignKey

class InscripcionModel(Base):
    __tablename__ = "inscripciones"
    
    id = Column(Integer, primary_key = True)
    evento_id = Column(Integer, ForeignKey("eventos.id"), nullable=False)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    fecha_inscripción = Column(Date)