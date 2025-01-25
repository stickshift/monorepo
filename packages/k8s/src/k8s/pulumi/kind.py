"""Kubernetes Pulumi resource."""

import importlib.resources

from anyio import Path
from pulumi_command.local import Command

__all__ = [
    "cluster",
    "kube_config_path",
]


async def kube_config_path(cluster_name: str) -> Path:
    home_path = await Path.home()
    return home_path / ".kube" / f"{cluster_name}"


async def cluster(resource_name: str) -> Command:
    package_path = importlib.resources.files(__package__)
    config_path = package_path.joinpath("kind.yaml")
    kubeconfig = await kube_config_path(resource_name)

    resource = Command(
        resource_name,
        create=f"kind create cluster --name {resource_name} --config {config_path} --kubeconfig {kubeconfig}",
        delete=f"kind delete cluster --name {resource_name}",
    )

    return resource
