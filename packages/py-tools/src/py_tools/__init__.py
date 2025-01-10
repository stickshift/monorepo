import secrets

__all__ = [
    "random_string",
]


def random_string() -> str:
    """Generate random string."""
    return secrets.token_hex()
