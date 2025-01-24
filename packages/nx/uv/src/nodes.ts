import {
  CreateNodesV2,
  TargetConfiguration,
  createNodesFromFiles,
} from "@nx/devkit"

import { readdir } from "node:fs/promises"
import { dirname } from "path"

import { PluginOptions } from "./schema"
import { getPyProject } from "./tools"

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

async function createNodesInternal(
  configFilePath: string,
  options: PluginOptions | undefined
) {
  const projectRoot = dirname(configFilePath)
  const pyproject = await getPyProject(configFilePath)

  // Skip if pyproject.toml doesn'y exist
  if (!pyproject) {
    return {}
  }

  // Skip if pyproject.toml doesn't have a build-backend
  if (!("build-backend" in pyproject["build-system"])) {
    return {}
  }

  // Verify project.json exists
  const siblingFiles = await readdir(projectRoot)
  if (!siblingFiles.includes("project.json")) {
    return {}
  }

  // Inferred task final output
  const buildTarget: TargetConfiguration = {
    executor: "@stickshift/uv:build",
    cache: true,
    dependsOn: ["^build"],
    inputs: ["default"],
    outputs: [`{workspaceRoot}/dist/${pyproject.project.name}-*`],
  }

  // Project configuration to be merged into the rest of the Nx configuration
  const buildTargetName = options?.buildTargetName ?? "build"

  return {
    projects: {
      [projectRoot]: {
        targets: {
          [buildTargetName]: buildTarget,
        },
      },
    },
  }
}
