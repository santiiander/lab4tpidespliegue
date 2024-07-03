from config.database import Base
from sqlalchemy import Column, Integer, String

class UsuarioModel(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key = True)
    nombre = Column(String(30))
    email = Column(String(50))
    rol = Column(String(20))
    password = Column(String(150))
