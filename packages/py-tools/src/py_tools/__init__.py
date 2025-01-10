import secrets

__all__ = [
    "random_string",
]


def random_string(length: int | None = None) -> str:
    """Generate random string."""
    # Defaults
    length = length if length is not None else 8

    return secrets.token_hex(nbytes=length // 2).upper()
