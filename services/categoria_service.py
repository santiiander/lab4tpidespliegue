from models.categoria_model import CategoriaModel
from schemas.categoria_schema import CategoriaSchema
from utilss.validators import idDuplicados


class CategoriaService():
    
    def __init__(self, db) -> None:
        self.db = db

    def get_categorias(self):
        result = self.db.query(CategoriaModel).all()
        return result
    
    def get_categoria(self, id:int):
        result = self.db.query(CategoriaModel).filter(CategoriaModel.id == id).first()
        return result
    
    def create_categoria(self, categoria: CategoriaSchema):
        lista = self.get_categorias()
        idDuplicados(categoria, lista)
        new_categoria = CategoriaModel(**categoria.model_dump())
        self.db.add(new_categoria)
        self.db.commit()
        return new_categoria
    
    def update_categoria(self, id: int, categoria: CategoriaSchema):
        result = self.db.query(CategoriaModel).filter(CategoriaModel.id == id).first()
        result.nombre = categoria.nombre
        result.descripcion = categoria.descripcion
        self.db.commit()
        return result
    
    def delete_categoria(self, id:int):
        self.db.query(CategoriaModel).filter(CategoriaModel.id == id).delete()
        self.db.commit()
        return True