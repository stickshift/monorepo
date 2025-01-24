from collections.abc import AsyncIterator
import tempfile

from anyio import Path
import pytest

__all__ = [
    "tmp_path",
]


@pytest.fixture
async def tmp_path() -> AsyncIterator[Path]:
    """Overrides default tmp_path to return async Path."""
    dir = tempfile.TemporaryDirectory()

    yield Path(dir.name)
