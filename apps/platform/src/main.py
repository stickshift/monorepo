"""Pulumi entrypoint."""

from pulumi import Output

from k8s.pulumi import kind

k8s = kind.cluster("monorepo")

output = Output.from_input(k8s)
