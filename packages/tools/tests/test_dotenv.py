from anyio import Path
from dotenv import dotenv_values

from tools import merge_dotenv


async def test_merge_dotenv(tmp_path: Path):
    #
    # Givens
    #

    # Path to empty .env file
    path = tmp_path / ".env"

    #
    # Whens
    #

    # I merge {"x": "a"}
    await merge_dotenv(path, {"x": "a"})

    #
    # Thens
    #

    # Reading file back in should be {"x": "a'"}
    assert dotenv_values(path) == {"x": "a"}

    #
    # Whens
    #

    # I merge {"y": "b"}
    await merge_dotenv(path, {"y": "b"})

    #
    # Thens
    #

    # Reading file back in should be {"x": "a", "y": "b"}
    assert dotenv_values(path) == {"x": "a", "y": "b"}

    #
    # Whens
    #

    # I merge {"x": "b"}
    await merge_dotenv(path, {"x": "b"})

    #
    # Thens
    #

    # Reading file back in should be {"x": "b", "y": "b"}
    assert dotenv_values(path) == {"x": "b", "y": "b"}
