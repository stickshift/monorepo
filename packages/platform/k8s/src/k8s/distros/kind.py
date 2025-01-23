"""Kind distro."""

from anyio import Path

from k8s.models import Config

__all__ = [
    "create_cluster",
    "delete_cluster",
    "get_cluster",
]


async def create_cluster(cluster_name: str) -> Config | None:
    config = await get_cluster(cluster_name)
    if config:
        return config

    return None


async def get_cluster(cluster_name: str) -> Config | None:
    pass


async def delete_cluster(cluster_name: str) -> bool:
    pass


async def _config_path(cluster_name: str) -> Path:
    home_path = await Path.home()
    return home_path / ".kube" / f"{cluster_name}.yaml"
