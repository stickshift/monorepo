from typing import Literal

from anyio import Path
from pydantic import BaseModel, Field
import yaml

__all__ = [
    "Cluster",
    "ClusterSpec",
    "Config",
    "Context",
    "ContextSpec",
    "User",
    "UserCertificateSpec",
    "UserExecSpec",
    "UserSpec",
    "UserTokenSpec",
    "context",
    "load",
]


class ClusterSpec(BaseModel):
    server: str = Field(alias="server")
    certificate_authority_data: str = Field(alias="certificate-authority-data")


class Cluster(BaseModel):
    name: str = Field(alias="name")
    cluster: ClusterSpec = Field(alias="cluster")


class UserCertificateSpec(BaseModel):
    client_certificate_data: str = Field(alias="client-certificate-data")
    client_key_data: str = Field(alias="client-key-data")


class UserExecSpec(BaseModel):
    exec: dict = Field(alias="exec")  # noqa: A003


class UserTokenSpec(BaseModel):
    token: str = Field(alias="token")


UserSpec = UserCertificateSpec | UserExecSpec | UserTokenSpec


class User(BaseModel):
    name: str = Field(alias="name")
    user: UserSpec = Field(alias="user")


class ContextSpec(BaseModel):
    cluster: str = Field(alias="cluster")
    user: str = Field(alias="user")


class Context(BaseModel):
    name: str = Field(alias="name")
    context: ContextSpec = Field(alias="context")


class Config(BaseModel):
    api_version: Literal["v1"] = Field("v1", alias="api-version")
    kind: Literal["Config"] = Field("Config", alias="kind")
    preferences: dict = Field({}, alias="preferences")
    current_context: str = Field(alias="current-context")
    clusters: tuple[Cluster, ...] = Field((), alias="clusters")
    users: tuple[User, ...] = Field((), alias="users")
    contexts: tuple[Context, ...] = Field((), alias="contexts")


async def load(path: Path) -> Config:
    data = yaml.safe_load(await path.read_text())

    return Config.model_validate(data)


def context(config: Config) -> tuple[ClusterSpec, UserSpec]:
    """Parses current context from config_resource."""
    # Lookup context
    context_spec = next(c.context for c in config.contexts if c.name == config.current_context)

    # Lookup cluster
    cluster_spec = next(c.cluster for c in config.clusters if c.name == context_spec.cluster)

    # Lookup user
    user_spec = next(u.user for u in config.users if u.name == context_spec.user)

    return cluster_spec, user_spec
