from pydantic import BaseModel, Field

class CategoriaSchema(BaseModel):
    id: int = Field(gt=0)
    nombre: str = Field(min_length=1, max_length=20)
    descripcion: str = Field(min_length=1, max_length=160)