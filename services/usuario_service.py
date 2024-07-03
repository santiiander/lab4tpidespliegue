from passlib.context import CryptContext
from models.usuario_model import UsuarioModel
from schemas.usuario_schema import UsuarioSchema,UsuarioBaseSchema
from utilss.validators import idDuplicados,emailDuplicado

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UsuarioService():
    def __init__(self, db) -> None:
        self.db = db

    def get_usuarios(self):
        result = self.db.query(UsuarioModel).all()
        return result
    
    def get_usuario(self, id):
        result = self.db.query(UsuarioModel).filter(UsuarioModel.id == id).first()
        return result
    
    def create_usuario(self, user: UsuarioSchema):
        lista = self.get_usuarios()
        idDuplicados(user, lista)
        emailDuplicado(user,lista)
        contrasenia_hasheada = pwd_context.hash(user.password)
        user.password = contrasenia_hasheada
        result = UsuarioModel(**user.model_dump())
        self.db.add(result)
        self.db.commit()
        self.db.refresh(result)
        return result

    def update_usuario(self, id: int, user: UsuarioSchema):
        result = self.db.query(UsuarioModel).filter(UsuarioModel.id == id).first()
        if result.email != user.email:
            lista = self.get_usuarios()
            emailDuplicado(user,lista)
            result.email = user.email
        result.nombre = user.nombre
        result.rol = user.rol
        contrasenia_hasheada = pwd_context.hash(user.password)
        result.password = contrasenia_hasheada
        self.db.commit()
        self.db.refresh(result)
        return result
    
    def delete_usuario(self, id:int):
        self.db.query(UsuarioModel).filter(UsuarioModel.id == id).delete()
        self.db.commit()
        return True