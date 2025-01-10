"""REST Endpoint."""

from fastapi import FastAPI

import py_tools

app = FastAPI()


@app.get("/")
def index():
    """Index entrypoint."""
    return py_tools.random_string()
