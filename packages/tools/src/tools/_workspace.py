import os

from anyio import Path

__all__ = [
    "workspace_path",
]


def workspace_path() -> Path:
    if "NX_WORKSPACE_ROOT" not in os.environ:
        raise ValueError("Undefined environment variable NX_WORKSPACE_ROOT")

    return Path(os.environ["NX_WORKSPACE_ROOT"])
