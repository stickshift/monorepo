import secrets

__all__ = [
    "random_string",
]

def random_string() -> str:
    return secrets.token_hex()