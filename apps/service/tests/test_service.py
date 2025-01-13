from anyio import Path
from fastapi.testclient import TestClient


def test_index(workspace_path: Path, service_client: TestClient) -> None:
    #
    # Whens
    #

    # I send get request to /
    response = service_client.get("/")

    #
    # Thens
    #

    # Assert
    assert response.status_code == 200
