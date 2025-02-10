from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings
from typing import Generator
from sqlalchemy.pool import StaticPool

SQLITE_URL = "sqlite:///:memory:"


def get_engine(testing: bool = False):
    """Create SQLAlchemy engine based on configuration"""
    if testing:
        return create_engine(
            SQLITE_URL,
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
    return create_engine(settings.SQLALCHEMY_DATABASE_URI)


# Create initial engine
engine = get_engine(settings.TESTING)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    """Dependency function that yields db sessions"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
