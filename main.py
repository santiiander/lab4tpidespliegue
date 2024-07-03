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

# Configuración de Jinja para renderizar plantillas en TP/templates
templates = Jinja2Templates(directory="templates")

@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    # Consultas a la base de datos para obtener datos estadísticos
    query_eventos = "SELECT COUNT(*) FROM eventos"
    query_inscripciones = "SELECT COUNT(*) FROM inscripciones"
    query_promedio_usuarios = """
        SELECT AVG(user_count) FROM (
            SELECT COUNT(usuario_id) AS user_count
            FROM inscripciones
            GROUP BY evento_id
        ) AS subquery
    """
    query_evento_max_inscripciones = """
        SELECT evento_id, COUNT(usuario_id) AS count
        FROM inscripciones
        GROUP BY evento_id
        ORDER BY count DESC
        LIMIT 1
    """

    # Ejecutar las consultas y obtener los resultados
    total_eventos = await database.fetch_val(query_eventos)
    total_inscripciones = await database.fetch_val(query_inscripciones)
    promedio_usuarios = await database.fetch_val(query_promedio_usuarios)
    evento_max_inscripciones = await database.fetch_one(query_evento_max_inscripciones)

    # Preparar los datos para pasarlos a la plantilla
    evento_max_inscripciones_dict = {
        "evento_id": evento_max_inscripciones[0],
        "count": evento_max_inscripciones[1]
    } if evento_max_inscripciones else None

    # Renderizar la plantilla "dashboard.html" con los datos obtenidos
    return templates.TemplateResponse("dashboard.html", {
        "request": request,
        "title": "Dashboard",
        "total_eventos": total_eventos,
        "total_inscripciones": total_inscripciones,
        "promedio_usuarios": promedio_usuarios,
        "evento_max_inscripciones": evento_max_inscripciones_dict
    })
