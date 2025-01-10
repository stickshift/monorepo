# Monorepo

Demo build system that blends modern TypeScript and Python tools into a single, streamlined monorepo toolchain.

## Prerequisites

Monorepo uses [asdf](https://asdf-vm.com/) to manage a short list of top level tools in `~/.asdf`.

* Bun
* Python
* UV

Use the following steps to configure a new development machine.

```shell
# Install asdf
brew install asdf

# Install asdf plugins
asdf plugin add bun
asdf plugin add python
asdf plugin add uv

# Install tools
asdf install
```

## Components

The goal is to demonstrate building a monorepo with a mixture of TypeScript and Python components.

```
apps/
  service/  # Python rest endpoint
  web-app/  # TypeScript web-app
packages/
  py-tools/ # Python package
  ts-tools/ # Typescript package
```

## Workflow

```shell
# Install dependencies
bun install:all

# Launch development servers
bun dev

# Check code
bun check

# Fix code
bun fix

# Reset everything
bun clean
```

## Demo

### Launch

```shell
# Install dependencies
bun install:all

# Check code
bun check

# Launch dev servers
bun dev

# Open web-app
open http://localhost:3000/
```

### Fix bug
```python
from fastapi.responses import PlainTextResponse
@app.get("/", response_class=PlainTextResponse)
```
