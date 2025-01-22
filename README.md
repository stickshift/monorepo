# Monorepo

Demo repo that blends TypeScript, Python, Containers, and Kubernetes into a single, streamlined monorepo toolchain.

## Prerequisites

Monorepo uses [asdf](https://asdf-vm.com/) to manage a short list of top level tools in `~/.asdf`.

Use the following steps to configure a new development machine.

```shell
# Install tools
brew install asdf
plugins=(nodejs python pulumi kind kubectl helm)
for p in $plugins;do asdf plugin add $p;done
asdf install
```

## Components

Monorepo includes a web app, an api, and a series of containerized components all deployed in Kubernetes.

```
apps/
  # Kubernetes cluster w/ supporting components
  platform/  
  
  # Backend API (Python)
  api/

  # Frontend Web App (TypeScript)
  web-app/

packages/
  ...
```

## Workflow

```shell
# Install dependencies
npm install

# Launch development servers
npm run dev

# Check code
npm run lint:check

# Fix code
npm run lint:fix

# Reset everything
npm run clean
```
