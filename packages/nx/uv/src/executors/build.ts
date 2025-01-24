import { PromiseExecutor, ExecutorContext } from "@nx/devkit"
import { BuildExecutorSchema } from "./schema"
import { getProjectRoot, runUv } from "../tools"

const runExecutor: PromiseExecutor<BuildExecutorSchema> = async (
  options: BuildExecutorSchema,
  context: ExecutorContext
) => {
  const projectRoot = getProjectRoot(context)

  await runUv(["build"], { cwd: projectRoot })

  return { success: true }
}

export default runExecutor
