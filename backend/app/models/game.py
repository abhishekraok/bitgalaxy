from sqlalchemy import Column, String, JSON, DateTime
from sqlalchemy.sql import func
from app.db.base_class import Base


class Game(Base):
    __tablename__ = "games"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    configuration = Column(JSON, nullable=False)
    state = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
