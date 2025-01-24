import {
  ImplicitDependency,
  DependencyType,
  CreateDependencies,
  CreateDependenciesContext,
  ProjectConfiguration,
  joinPathFragments,
} from "@nx/devkit"

import { existsSync } from "fs"

import { getPyprojectData, UVPyprojectToml } from "../tools/tools"

export const createDependencies: CreateDependencies = async (
  options,
  context: CreateDependenciesContext
) => {
  const result: ImplicitDependency[] = []

  for (const project in context.projects) {
    const deps = getDependencies(project, context.projects)

    deps.forEach((dep) => {
      result.push({
        source: project,
        target: dep,
        type: DependencyType.implicit,
      })
    })
  }
  return result
}

const getDependencies = (
  projectName: string,
  projects: Record<string, ProjectConfiguration>
) => {
  const projectData = projects[projectName]
  const pyprojectToml = joinPathFragments(projectData.root, "pyproject.toml")

  const deps: string[] = []

  if (existsSync(pyprojectToml)) {
    const tomlData = getPyprojectData<UVPyprojectToml>(pyprojectToml)

    deps.push(
      ...resolveDependencies(tomlData, tomlData?.project?.dependencies || [])
    )

    for (const group in tomlData["dependency-groups"]) {
      deps.push(
        ...resolveDependencies(tomlData, tomlData["dependency-groups"][group])
      )
    }
  }

  return deps
}

const resolveDependencies = (
  pyprojectData: UVPyprojectToml,
  dependencies: string[]
) => {
  const deps: string[] = []
  const sources = pyprojectData.tool?.uv?.sources ?? {}

  for (const dep of dependencies) {
    if (sources[dep]) {
      deps.push(dep)
    }
  }

  return deps
}
