from collections.abc import Sequence
from typing import Literal, NamedTuple

__all__ = [
    "Cluster",
    "ClusterSpec",
    "Config",
    "Context",
    "ContextSpec",
    "User",
    "UserCertificateSpec",
    "UserExecSpec",
    "UserTokenSpec",
]


# --------------------------------------------------------------------------------
# Config
# --------------------------------------------------------------------------------


class ClusterSpec(NamedTuple):
    server: str
    certificate_authority_data: str


class Cluster(NamedTuple):
    name: str
    cluster: ClusterSpec


class UserCertificateSpec(NamedTuple):
    client_certificate_data: str
    client_key_data: str


class UserExecSpec(NamedTuple):
    exec: dict  # noqa: A003


class UserTokenSpec(NamedTuple):
    token: str


class User(NamedTuple):
    name: str
    user: UserCertificateSpec | UserExecSpec | UserTokenSpec


class ContextSpec(NamedTuple):
    cluster: str
    user: str


class Context(NamedTuple):
    name: str
    context: ContextSpec


class Config(NamedTuple):
    api_version: Literal["v1"] = "v1"
    kind: Literal["Config"] = "Config"
    current_context: str | None = None
    clusters: Sequence[Cluster] = []
    users: Sequence[User] = []
    contexts: Sequence[Context] = []
