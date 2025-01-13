from anyio import Path
import pytest
from _pytest.config import Config

__all__ = [
    "workspace_path",
]


@pytest.fixture
def workspace_path(pytestconfig: Config) -> Path:
    """Path to top level of repo."""
    return Path(pytestconfig.rootpath)
