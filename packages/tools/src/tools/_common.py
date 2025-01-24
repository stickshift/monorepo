from collections.abc import Callable, Mapping
import random
import secrets
import string
from typing import cast

from anyio import Path
from dotenv import dotenv_values

__all__ = [
    "default_arg",
    "merge_dotenv",
    "random_string",
]


def default_arg[T](
    v: T | None,
    default: T | None = None,
    default_factory: Callable[[], T] | None = None,
) -> T:
    """Populate default parameters."""
    if v is not None:
        return v

    if default is None and default_factory is not None:
        return default_factory()

    return cast(T, default)


def random_string(length: int | None = None):
    """Generate a random string of hexadecimal digits.

    Args:
        length (int): (Optional) The length of the string to generate. Defaults to 8.

    Returns:
        str: a random string of hexadecimal digits
    """
    # Defaults
    length = default_arg(length, 8)

    # Always prefix with a character to ensure value is a string
    return random.choice(string.ascii_lowercase) + secrets.token_hex(int(length / 2))[1:]


async def merge_dotenv(path: Path, updates: Mapping[str, str]):
    # Validate
    if await path.exists() and not await path.is_file():
        raise ValueError(f"Invalid .env path {path}")

    data = {}
    if await path.exists():
        data = dotenv_values(path)

    data.update(updates)

    lines = []
    for k, v in data.items():
        lines.append(f"{k}={v}")

    content = "\n".join(lines) + "\n"
    await path.write_text(content)
