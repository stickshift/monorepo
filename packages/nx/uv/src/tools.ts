import { ExecutorContext } from "@nx/devkit"
import { spawn, SpawnOptions } from "node:child_process"
import * as toml from "@iarna/toml"
import { readFile } from "node:fs/promises"
import { PyProject, PyProjectSchema } from "./schema"
import chalk from "chalk-template"

export const UV_EXECUTABLE = "uv"

/**
 * Look up project root path.
 */
export const getProjectRoot = (context: ExecutorContext) => {
  if (!context.projectName) {
    throw new Error("Project name is required")
  }

  return context.projectsConfigurations.projects[context.projectName].root
}

/**
 * Load pyproject.toml as PyProject.
 *
 * @param path path to pyproject.toml
 * @returns Promise<toml.JsonMap> or null if file doesn't exist.
 */
export const getPyProject = async (path: string): Promise<PyProject | null> => {
  try {
    const json = toml.parse(await readFile(path, { encoding: "utf8" }))
    const pyproject = PyProjectSchema.parse(json)

    return pyproject
  } catch (error) {
    // Return null if pyprojectPath doesn't exist
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null
    }

    throw error
  }
}

/**
 * Run uv commands.
 */
export const runUv = async (args: string[], options: SpawnOptions = {}) => {
  const cmd = `${UV_EXECUTABLE} ${args.join(" ")}`
  const cwd = options.cwd ?? "workspace"

  console.log(chalk`{dim > cd ${cwd} &&} ${cmd}\n`)

  return new Promise<void>((resolve, reject) => {
    const uv = spawn(UV_EXECUTABLE, args, options)

    uv.on("error", (err) => {
      reject(new Error(chalk`Spawning {bold ${cmd}} failed: ${err.message}`))
    })

    uv.stdout.on("data", (data: Buffer) => {
      console.log(data.toString())
    })

    uv.stderr.on("data", (data) => {
      console.log(data.toString())
    })

    uv.on("exit", (code) => {
      if (code !== 0) {
        return reject(
          new Error(chalk`{bold ${cmd}} failed with status {bold ${code}}`)
        )
      }

      resolve()
    })
  })
}
