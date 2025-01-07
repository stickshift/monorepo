# Monorepo

Demo build system that blends modern TypeScript and Python tools into a single, streamlined monorepo toolchain.

## Prerequisites

Monorepo uses [asdf](https://asdf-vm.com/) to manage a short list of top level tools in `~/.asdf`.

* Node
* Python
* UV

Use the following steps to configure a new development machine.

```shell
# Install asdf
brew install asdf

# Install asdf plugins
asdf plugin add nodejs
asdf plugin add python
asdf plugin add uv

# Install tools
asdf install
```

## Components

The goal is to demonstrate building a monorepo with a mixture of TypeScript and Python components.

```
apps/
    service-a/  # TypeScript service (depends on package-a package)
    service-b/  # Python service (depends on package-b package)
packages/
    package-a/  # TypeScript package
    package-b/  # Python package
```

## Workflow

* The build and test workflow is driven by npm at the top level.
* npm is used to build and manage JavaScript dependencies.
* UV is used to build and manage Python dependencies.
* Turborepo is used to orchestrate and cache build tasks.

```shell
# Install dependencies
npm install

# Launch local dev env
npm dev
```


