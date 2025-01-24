"""Pulumi entrypoint."""

from k8s.pulumi import kind
from pulumi import Output

k8s = kind.cluster("monorepo")

output = Output.from_input(k8s)
