from fastapi import Depends, FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from config.database import engine, Base, Session
from routers.categoria_router import categoria_router
from routers.usuario_router import usuario_router
from routers.evento_router import evento_router
from routers.inscripcion_router import inscripcion_router
from routers.userauth_router import userauth_router
from middleware.error_handler import ErrorHandler
from middleware.jwt_bearer import JWTBearer
import databases

Base.metadata.create_all(bind=engine)

app = FastAPI(dependencies=[Depends(JWTBearer())])
app.title = "TPI Lab IV Grupo-"

# Agregar middleware para manejo de errores
app.add_middleware(ErrorHandler)

# Configurar CORS
origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:3000",
    "http://127.0.0.1:5500",
    # Agrega aquí otros orígenes permitidos
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos
    allow_headers=["*"],  # Permitir todos los encabezados
)

# Incluir routers
app.include_router(userauth_router)
app.include_router(categoria_router)
app.include_router(usuario_router)
app.include_router(evento_router)
app.include_router(inscripcion_router)
