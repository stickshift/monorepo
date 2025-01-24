import {
  CreateNodesContextV2,
  CreateNodesV2,
  TargetConfiguration,
  createNodesFromFiles,
} from "@nx/devkit"
import { readdirSync } from "fs"
import { dirname, join } from "path"
import { getPyprojectData, UVPyprojectToml } from "../tools/tools"

// Expected format of the plugin options defined in nx.json
export interface UVPluginOptions {
  buildTargetName?: string
}

// File glob to find all the configuration files for this plugin
const pythonConfigGlob = "**/pyproject.toml"

// Entry function that Nx calls to modify the graph
export const createNodesV2: CreateNodesV2<UVPluginOptions> = [
  pythonConfigGlob,
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
  options: UVPluginOptions | undefined,
  context: CreateNodesContextV2
) {
  const projectRoot = dirname(configFilePath)
  const projectData = getPyprojectData<UVPyprojectToml>(configFilePath)

  // Verify project.json exists
  const siblingFiles = readdirSync(join(context.workspaceRoot, projectRoot))
  if (!siblingFiles.includes("project.json")) {
    return {}
  }

  // Inferred task final output
  const buildTarget: TargetConfiguration = {
    executor: "@stickshift/uv:build",
    cache: true,
    dependsOn: ["^build"],
    inputs: ["default"],
    outputs: [`{workspaceRoot}/dist/${projectData.project.name}-*`],
  }

  // Project configuration to be merged into the rest of the Nx configuration
  let buildTargetName = "build"
  if (options && options.buildTargetName) {
    buildTargetName = options.buildTargetName
  }

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
