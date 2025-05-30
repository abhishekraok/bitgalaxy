import pytest
from typing import Generator, Dict
from fastapi.testclient import TestClient
from sqlalchemy.orm import sessionmaker
from app.db.base_class import Base
from app.db.session import SQLITE_URL, get_engine
from app.main import app
from app.core.config import settings
from app.db.session import get_db

# Override settings immediately at module import time
settings.TESTING = True
settings.DATABASE_URL = SQLITE_URL

# Use an in-memory SQLite database for testing
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///:memory:"


@pytest.fixture(scope="session", autouse=True)
def set_test_settings():
    # Use centralized engine creation
    test_engine = get_engine(testing=True)

    # Create all tables in the test database
    Base.metadata.drop_all(bind=test_engine)
    Base.metadata.create_all(bind=test_engine)

    # Override the SessionLocal in the main app
    TestingSessionLocal = sessionmaker(
        autocommit=False, autoflush=False, bind=test_engine
    )
    app.dependency_overrides[get_db] = lambda: TestingSessionLocal()

    yield

    # Cleanup
    Base.metadata.drop_all(bind=test_engine)
    app.dependency_overrides.clear()


@pytest.fixture(scope="function")
def db() -> Generator:
    # Use centralized engine creation
    test_engine = get_engine(testing=True)

    # Create all tables for this test
    Base.metadata.create_all(bind=test_engine)

    TestingSessionLocal = sessionmaker(
        autocommit=False, autoflush=False, bind=test_engine
    )

    connection = test_engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    try:
        yield session
    finally:
        session.close()
        transaction.rollback()
        connection.close()
        # Clean up tables after the test
        Base.metadata.drop_all(bind=test_engine)


@pytest.fixture(scope="function")
def client(db) -> Generator:
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture
def test_user(db) -> Dict[str, str]:
    return {
        "email": f"test{id(db)}@example.com",
        "password": "test123",
        "username": f"testuser{id(db)}",
    }
