"""Pulumi entrypoint."""

import pulumi
from pulumi import Output

from k8s.pulumi import kind as k8s_distro


def resource_name(name: str) -> str:
    return f"{pulumi.get_project()}-{pulumi.get_stack()}-{name}"


k8s = k8s_distro.cluster(resource_name("k8s"))

output = Output.from_input(k8s)
