from pydantic_settings import BaseSettings
from typing import Optional
from functools import cached_property


class Settings(BaseSettings):
    PROJECT_NAME: str = "BitGalaxy"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # Database settings
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "gamedb"

    ANTHROPIC_API_KEY: str = "dummy-key-for-testing"  # Default for testing
    SECRET_KEY: str = "dummy-secret-for-testing"  # Default for testing

    # JWT token configuration
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days

    # Testing flag
    TESTING: bool = False

    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        if self.TESTING:
            return "sqlite:///:memory:"
        return (
            f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_SERVER}/{self.POSTGRES_DB}"
        )

    class Config:
        env_file = ".env"
        arbitrary_types_allowed = True  # Allow arbitrary types
        extra = "allow"  # Allow extra fields


settings = Settings()
