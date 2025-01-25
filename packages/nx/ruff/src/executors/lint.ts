import { PromiseExecutor, ExecutorContext } from "@nx/devkit"
import { LintExecutorSchema } from "./schema"
import { runUv, getProjectRoot } from "@stickshift/uv"

const runExecutor: PromiseExecutor<LintExecutorSchema> = async (
  options: LintExecutorSchema,
  context: ExecutorContext
) => {
  const projectRoot = getProjectRoot(context)

  const args = ["run", "ruff", "check"]

  if (options.fix) {
    args.push("--fix")
  }

  if (options.preview) {
    args.push("--preview")
  }

  await runUv(args, { cwd: projectRoot })

  return { success: true }
}

export default runExecutor
