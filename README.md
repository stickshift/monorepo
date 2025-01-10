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
packages/
```

## Workflow

```shell
# Install dependencies
bun install:all

# Launch development servers
bun dev

# Reset
bun clean
```
