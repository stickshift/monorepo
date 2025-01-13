from anyio import Path

from py_tools import random_string


def test_random(workspace_path: Path) -> None:
    #
    # Whens
    #

    # I generate random string
    s = random_string()

    #
    # Thens
    #

    # s should be 8 characters long
    assert len(s) == 8
