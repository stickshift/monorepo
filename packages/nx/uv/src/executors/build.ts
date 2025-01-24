import { PromiseExecutor, ExecutorContext } from "@nx/devkit"
import { BuildExecutorSchema } from "./schema"
import { runUv } from "../tools/tools"

const build: PromiseExecutor<BuildExecutorSchema> = async (
  options: BuildExecutorSchema,
  context: ExecutorContext
) => {
  const projectRoot = getProjectRoot(context)

  runUv(["build"], { cwd: projectRoot })

  return { success: true }
}

const getProjectRoot = (context: ExecutorContext) => {
  if (!context.projectName) {
    throw new Error("Project name is required")
  }

  return context.projectsConfigurations.projects[context.projectName].root
}

export default build
