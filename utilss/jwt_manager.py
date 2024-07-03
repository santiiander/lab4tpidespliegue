from jwt import decode, encode
from datetime import datetime, timedelta
import jwt

SECRET_KEY = "my_secret_key"
ALGORITHM = "HS256"

def create_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    new_token = encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return new_token

def validate_token(token: str) -> dict:
    try:
        data = decode(token, key=SECRET_KEY, algorithms=[ALGORITHM])
        return data
    except jwt.ExpiredSignatureError:
        raise Exception("Token expirado")
    except jwt.InvalidTokenError:
        raise Exception("Token invalido")
