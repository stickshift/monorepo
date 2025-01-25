from base64 import b64decode
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
import logging
import ssl
import tempfile
from typing import NamedTuple

from aiohttp import ClientSession, TCPConnector
from anyio import Path

import k8s.config
from k8s.config import UserCertificateSpec, UserTokenSpec

__all__ = [
    "Cluster",
    "cluster",
]

logger = logging.getLogger(__name__)


class Cluster(NamedTuple):
    api: ClientSession


@asynccontextmanager
async def cluster(config_path: Path) -> AsyncIterator[Cluster]:
    config = await k8s.config.load(config_path)
    cluster_spec, user_spec = k8s.config.context(config)

    url = cluster_spec.server
    headers = {}

    with tempfile.TemporaryDirectory() as work_dir:
        work_path = Path(work_dir)

        # Load ca cert
        ca_certificate = b64decode(cluster_spec.certificate_authority_data.encode()).decode()
        ssl_context = ssl.create_default_context(cadata=ca_certificate)

        # Write ca cert to file for debugging
        ca_certificate_path = work_path / "ca.crt"
        await ca_certificate_path.write_text(ca_certificate)

        # Certificate auth
        if isinstance(user_spec, UserCertificateSpec):
            # Decode client certs
            client_certificate = b64decode(user_spec.client_certificate_data.encode()).decode()
            client_key = b64decode(user_spec.client_key_data.encode()).decode()

            # Load client certs into ssl_context
            client_certificate_path = work_path / "client.crt"
            await client_certificate_path.write_text(client_certificate)

            client_key_path = work_path / "client.key"
            await client_key_path.write_text(client_key)

            ssl_context.load_cert_chain(client_certificate_path, client_key_path)

            logger.debug(
                f"Debug w/ 'curl --cacert {ca_certificate_path} --cert {client_certificate_path} --key {client_key_path} {url} ...'"
            )

        # Token auth
        elif isinstance(user_spec, UserTokenSpec):
            headers["Authorization"] = f"Bearer {user_spec.token}"

            logger.debug(
                f"Debug w/ 'curl --cacert {ca_certificate_path} -H \"Authorization: {headers['Authorization']}\" {url} ...'"
            )

        else:
            raise ValueError(f"Unsupported user spec: {user_spec}")

        # Initialize ClientSession with ssl_context
        connector = TCPConnector(ssl=ssl_context)
        async with ClientSession(url, connector=connector, headers=headers, raise_for_status=True) as http:
            yield Cluster(api=http)
