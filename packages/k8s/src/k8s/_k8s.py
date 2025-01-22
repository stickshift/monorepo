"""Kubernetes Pulumi resource."""
import importlib.resources

from pulumi_command.local import Command

__all__ = [
    "kind_cluster",
]


def kind_cluster(cluster_name: str) -> Command:
    package_path = importlib.resources.files(__package__)
    config_path = package_path.joinpath("kind.yaml")

    resource = Command(
        "k8s",
        create=f"kind create cluster --name {cluster_name} --config {config_path}",
        delete=f"kind delete cluster --name {cluster_name}",
    )

    return resource

