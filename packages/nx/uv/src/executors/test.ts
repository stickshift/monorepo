import { PromiseExecutor, ExecutorContext } from "@nx/devkit"
import { TestExecutorSchema } from "./schema"
import { getProjectRoot, runUv } from "../tools"

const runExecutor: PromiseExecutor<TestExecutorSchema> = async (
  options: TestExecutorSchema,
  context: ExecutorContext
) => {
  const extraArgs = []
  if (options.n > 1) {
    extraArgs.push(...["-n", options.n])
  }

  const args = ["run", "pytest", ...extraArgs, "tests"]

  await runUv(args, { cwd: getProjectRoot(context) })

  return { success: true }
}

export default runExecutor
