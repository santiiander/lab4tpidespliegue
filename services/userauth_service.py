from models.usuario_model import UsuarioModel
from schemas.usuario_schema import UsuarioBaseSchema, UsuarioSchema
from sqlalchemy.orm import Session
from passlib.context import CryptContext

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserAuthService:
    def __init__(self, db: Session, pwd_context: CryptContext):
        self.db = db
        self.pwd_context = pwd_context

    def verify_user_credentials(self, email: str, password: str) -> UsuarioModel:
        user = self.db.query(UsuarioModel).filter(UsuarioModel.email == email).first()
        if user and self.pwd_context.verify(password, user.password):
            return user
        return None
