import {
  CreateNodesV2,
  TargetConfiguration,
  createNodesFromFiles,
} from "@nx/devkit"

import { readdir } from "node:fs/promises"
import { dirname } from "path"

import { PluginOptions, PyProject } from "./schema"
import { getPyProject } from "./tools"
import { BuildExecutorSchema, TestExecutorSchema } from "./executors/schema"

// Identify all the configuration files for this plugin
const pythonConfigGlob = "**/pyproject.toml"

/**
 * Nodes entry point infers ProjectGraph content from pyproject.toml files.
 */
export const createNodesV2: CreateNodesV2<PluginOptions> = [
  pythonConfigGlob,
  async (configFiles, options, context) => {
    return await createNodesFromFiles(
      (configFile, options) => createNodesInternal(configFile, options),
      configFiles,
      options,
      context
    )
  },
]

const createNodesInternal = async (
  configFilePath: string,
  options: PluginOptions | undefined
) => {
  const projectRoot = dirname(configFilePath)
  const files = await readdir(projectRoot)

  // Skip if project is missing key config files
  const required = ["pyproject.toml", "project.json"]
  for (const f of required) {
    if (!files.includes(f)) {
      return {}
    }
  }

  const pyproject = await getPyProject(configFilePath)

  const buildTargets = getBuildTargets(pyproject, options)
  const testTargets = getTestTargets(pyproject, options, files)
  const targets = { ...buildTargets, ...testTargets }

  return {
    projects: {
      [projectRoot]: {
        targets: targets,
      },
    },
  }
}

const getBuildTargets = (
  pyproject: PyProject,
  options: PluginOptions | undefined
) => {
  // Skip if pyproject.toml doesn't have a build-backend
  if (!("build-backend" in pyproject["build-system"])) {
    return {}
  }

  const target: TargetConfiguration<BuildExecutorSchema> = {
    executor: "@stickshift/uv:build",
    cache: true,
    dependsOn: ["^build"],
    inputs: ["default"],
    outputs: [`{workspaceRoot}/dist/${pyproject.project.name}-*`],
  }

  const targetName = options?.buildTargetName ?? "build"

  return { [targetName]: target }
}

const getTestTargets = (
  pyproject: PyProject,
  options: PluginOptions | undefined,
  files: string[]
) => {
  // Skip if projectRoot doesn't have `tests` directory
  if (!files.includes("tests")) {
    return {}
  }
  // Skip if projectRoot doesn't have `conftest.py` directory
  if (!files.includes("conftest.py")) {
    return {}
  }

  const target: TargetConfiguration<TestExecutorSchema> = {
    executor: "@stickshift/uv:test",
    cache: true,
    dependsOn: [],
    inputs: ["default"],
    options: {
      n: 1,
    },
  }

  let targetName = options?.testTargetName ?? "test"

  if (pyproject.project.name == "e2e") {
    targetName = options?.e2eTestTargetName ?? "e2e"
  }

  return { [targetName]: target }
}
