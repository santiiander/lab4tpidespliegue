from config.database import Base
from sqlalchemy import Column, Integer, String

class CategoriaModel(Base):
    __tablename__ = "categorias"

    id = Column(Integer, primary_key = True)
    nombre = Column(String(20))
    descripcion = Column(String(160))