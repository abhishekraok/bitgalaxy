from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import get_password_hash


def test_create_user(db: Session, test_user: dict):
    user = User(
        email=test_user["email"],
        hashed_password=get_password_hash(test_user["password"]),
        username=test_user["username"],
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    assert user.email == test_user["email"]
    assert user.username == test_user["username"]
    assert user.hashed_password != test_user["password"]
