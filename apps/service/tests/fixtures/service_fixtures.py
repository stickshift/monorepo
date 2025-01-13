from fastapi.testclient import TestClient
import pytest
from service.endpoint import app

__all__ = [
    "service_client",
]


@pytest.fixture
def service_client() -> TestClient:
    return TestClient(app)
