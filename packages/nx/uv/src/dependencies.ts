import {
  ImplicitDependency,
  DependencyType,
  CreateDependencies,
  CreateDependenciesContext,
  ProjectConfiguration,
  joinPathFragments,
} from "@nx/devkit"
import { PluginOptions } from "./schema"
import { getPyProject } from "./tools"

/**
 * Dependencies entry point infers dependencies between Python projects based on project.dependencies and tool.uv.sources in pyproject.toml.
 */
export const createDependencies: CreateDependencies<PluginOptions> = async (
  options: PluginOptions,
  context: CreateDependenciesContext
) => {
  const result: ImplicitDependency[] = []

  for (const sourceProject in context.projects) {
    const deps = await getDependencies(sourceProject, context.projects)

    deps.forEach((targetProject) => {
      result.push({
        source: sourceProject,
        target: targetProject,
        type: DependencyType.implicit,
      })
    })
  }

  return result
}

const getDependencies = async (
  projectName: string,
  projects: Record<string, ProjectConfiguration>
) => {
  const projectData = projects[projectName]
  const pyprojectPath = joinPathFragments(projectData.root, "pyproject.toml")
  const pyproject = await getPyProject(pyprojectPath)

  // If project doesn't have pyproject.toml, we're done
  if (!pyproject) {
    return []
  }

  const targetProjects: string[] = []

  const dependencies = [
    ...pyproject.project.dependencies,
    ...Object.values(pyproject["dependency-groups"]).flat(),
  ]

  // Target projects = overlap between dependencies and workspace dependencies in tool.uv.sources
  for (const [sourceName, sourceConfig] of Object.entries(
    pyproject.tool.uv.sources
  )) {
    if (dependencies.includes(sourceName) && sourceConfig.workspace) {
      targetProjects.push(sourceName)
    }
  }

  return targetProjects
}
