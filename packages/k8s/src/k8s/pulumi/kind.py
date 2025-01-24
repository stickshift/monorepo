"""Kubernetes Pulumi resource."""

import importlib.resources

from anyio import Path
from pulumi_command.local import Command

__all__ = [
    "cluster",
]


async def cluster(cluster_name: str) -> Command:
    home_path = await Path.home()
    package_path = importlib.resources.files(__package__)
    config_path = package_path.joinpath("kind.yaml")
    kube_config_path = home_path / ".kube" / f"{cluster_name}"

    resource = Command(
        "k8s",
        create=f"kind create cluster --name {cluster_name} --config {config_path} --kubeconfig {kube_config_path}",
        delete=f"kind delete cluster --name {cluster_name}",
    )

    return resource
