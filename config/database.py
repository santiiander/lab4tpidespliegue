from sqlalchemy import create_engine

from sqlalchemy.orm import sessionmaker, declarative_base
DATABASE_URL = "mysql+mysqlconnector://root:IKfGnwoLmHnNxoJNfABdWQMcTXJRCFpS@roundhouse.proxy.rlwy.net:33173/railway"

engine = create_engine(DATABASE_URL)

Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
