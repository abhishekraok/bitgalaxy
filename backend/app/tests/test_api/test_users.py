from fastapi.testclient import TestClient


def test_create_user(client: TestClient):
    data = {"email": "test@example.com", "password": "test123", "username": "testuser"}
    response = client.post("/api/v1/users/", json=data)
    assert response.status_code == 201
    content = response.json()
    assert content["email"] == data["email"]
    assert content["username"] == data["username"]
    assert "id" in content


def test_create_user_invalid_email(client: TestClient):
    data = {"email": "invalid-email", "password": "test123", "username": "testuser"}
    response = client.post("/api/v1/users/", json=data)
    assert response.status_code == 422
