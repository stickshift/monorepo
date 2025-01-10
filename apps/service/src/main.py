from fastapi import FastAPI

import py_tools

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": py_tools.random_string()}
