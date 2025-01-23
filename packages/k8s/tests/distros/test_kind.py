from k8s.distros import kind
from tools import random_string


async def test_crud():
    #
    # Whens
    #

    # I generate random name
    cluster_name = f"test-{random_string()}"

    #
    # Thens
    #

    # Cluster should not exist
    assert await kind.get_cluster(cluster_name) is None

    #
    # Whens
    #

    # I create cluster
    cluster = await kind.create_cluster(cluster_name)

    #
    # Thens
    #

    # Cluster should exist
    assert await kind.get_cluster(cluster_name) == cluster

    #
    # Whens
    #

    # I delete cluster
    await kind.delete_cluster(cluster_name)

    #
    # Thens
    #

    # Cluster should not exist again
    assert await kind.get_cluster(cluster_name) is None
