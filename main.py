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

# Configuración de la base de datos asincrónica
DATABASE_URL = "mysql+aiomysql://root:admin@localhost:3306/tpi"
database = databases.Database(DATABASE_URL)

Base.metadata.create_all(bind=engine)

app = FastAPI()
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

# Configuración de Jinja2 Templates
templates = Jinja2Templates(directory="templates")

# Ruta para renderizar una plantilla sin autenticación
@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

# Incluir routers con JWTBearer en las rutas que requieren autenticación
app.include_router(userauth_router, dependencies=[Depends(JWTBearer())])
app.include_router(categoria_router, dependencies=[Depends(JWTBearer())])
app.include_router(usuario_router, dependencies=[Depends(JWTBearer())])
app.include_router(evento_router, dependencies=[Depends(JWTBearer())])
app.include_router(inscripcion_router, dependencies=[Depends(JWTBearer())])