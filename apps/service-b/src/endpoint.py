from fastapi import FastAPI

from package_b import random_string

app = FastAPI()


@app.get("/")
def read_root():
    return f"Hello world {random_string()}"
