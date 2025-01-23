"""Pulumi entrypoint."""

import pulumi
import k8s

k8s = k8s.kind_cluster("monorepo")
