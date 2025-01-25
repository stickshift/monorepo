from collections.abc import AsyncIterator

from anyio import Path
import pytest

import k8s.client
from k8s.client import Cluster
import k8s.pulumi.kind


@pytest.fixture
def kube_cluster_name() -> str:
    return "platform-dev-k8s"


@pytest.fixture
async def kube_config_path(kube_cluster_name: str) -> Path:
    return await k8s.pulumi.kind.kube_config_path(kube_cluster_name)


@pytest.fixture
async def cluster(kube_config_path: Path) -> AsyncIterator[Cluster]:
    async with k8s.client.cluster(kube_config_path) as c:
        yield c


async def test_healthy(cluster: Cluster):
    #
    # Whens
    #

    # I check cluster health
    response = await cluster.api.get("/readyz", raise_for_status=False)

    #
    # Thens
    #

    # Cluster should be healthy
    assert response.ok
