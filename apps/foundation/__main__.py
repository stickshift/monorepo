"""A Python Pulumi program"""

import pulumi
import foundation

k8s = foundation.k8s("monorepo")
