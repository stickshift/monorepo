import * as chalk from "chalk"
import { SpawnSyncOptions } from "child_process"
import * as commandExists from "command-exists"
import * as spawn from "cross-spawn"
import { readFileSync } from "fs"
import * as toml from "@iarna/toml"

export const UV_EXECUTABLE = "uv"

export async function checkUvExecutable() {
  try {
    await commandExists(UV_EXECUTABLE)
  } catch {
    throw new Error(
      "UV is not installed. Please install UV before running this command."
    )
  }
}

export type RunUvOptions = {
  log?: boolean
  error?: boolean
} & SpawnSyncOptions

export function runUv(args: string[], options: RunUvOptions = {}): void {
  const log = options.log ?? false
  const error = options.error ?? true
  delete options.log
  delete options.error

  const commandStr = `${UV_EXECUTABLE} ${args.join(" ")}`

  if (log) {
    console.log(
      chalk`{bold Running command}: '${commandStr}' ${
        options.cwd && options.cwd !== "."
          ? chalk`from {bold ${options.cwd}}`
          : ""
      }\n`
    )
  }

  const result = spawn.sync(UV_EXECUTABLE, args, {
    ...options,
    shell: options.shell ?? false,
    stdio: "inherit",
  })

  if (error && result.status !== 0) {
    throw new Error(
      chalk`{bold ${commandStr}} command failed with exit code {bold ${result.status}}`
    )
  }
}

export type UVPyprojectToml = {
  project: {
    name: string
    version: string
    dependencies: string[]
  }
  "dependency-groups": {
    [key: string]: string[]
  }
  tool?: {
    hatch?: {
      build?: {
        targets?: {
          wheel?: {
            packages: string[]
          }
        }
      }
      metadata?: {
        "allow-direct-references"?: boolean
      }
    }
    uv?: {
      sources?: {
        [key: string]: {
          path?: string
          workspace?: boolean
          index?: string
        }
      }
      index?: UVPyprojectTomlIndex[]
      workspace?: {
        members: string[]
      }
    }
  }
}

export type UVPyprojectTomlIndex = {
  name: string
  url: string
}

export const getPyprojectData = <T>(path: string): T => {
  const content = readFileSync(path).toString("utf-8")
  if (content.trim() === "") return {} as T

  return toml.parse(content) as T
}
