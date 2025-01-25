import {
  CreateNodesContextV2,
  CreateNodesV2,
  createNodesFromFiles,
  joinPathFragments,
} from "@nx/devkit"
import { existsSync } from "node:fs"
import { readdir } from "node:fs/promises"
import { dirname } from "path"

import { PluginOptions } from "./schema"

// Identify all the configuration files for this plugin
const configGlob = "**/ruff.toml"

/**
 * Nodes entry point infers ProjectGraph content from ruff.toml files.
 */
export const createNodesV2: CreateNodesV2<PluginOptions> = [
  configGlob,
  async (configFiles, options, context) => {
    return await createNodesFromFiles(
      (configFile, options, context) =>
        createNodesInternal(configFile, options, context),
      configFiles,
      options,
      context
    )
  },
]

async function createNodesInternal(
  configFilePath: string,
  options: PluginOptions | undefined,
  context: CreateNodesContextV2
) {
  const projectRoot = dirname(configFilePath)

  // Verify ruff.toml exists
  if (!existsSync(configFilePath)) {
    return {}
  }

  // Verify project.json exists
  const siblingFiles = await readdir(
    joinPathFragments(context.workspaceRoot, projectRoot)
  )
  if (!siblingFiles.includes("project.json")) {
    return {}
  }

  const targetNames = {
    format: options?.formatTargetName ?? "format",
    lint: options?.lintTargetName ?? "lint",
  }

  const targets = {}
  for (const [k, v] of Object.entries(targetNames)) {
    targets[v] = {
      executor: `@stickshift/ruff:${k}`,
      cache: true,
      configurations: {
        check: {
          fix: false,
          preview: true,
        },
        fix: {
          fix: true,
          preview: true,
        },
      },
      inputs: ["default"],
    }
  }

  return {
    projects: {
      [projectRoot]: {
        targets: targets,
      },
    },
  }
}
