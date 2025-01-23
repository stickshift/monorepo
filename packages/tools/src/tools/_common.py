from collections.abc import Callable
import random
import secrets
import string
from typing import cast

__all__ = [
    "default_arg",
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
