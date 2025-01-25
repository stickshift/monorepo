import { PromiseExecutor, ExecutorContext } from "@nx/devkit"
import { FormatExecutorSchema } from "./schema"
import { runUv, getProjectRoot } from "@stickshift/uv"

const runExecutor: PromiseExecutor<FormatExecutorSchema> = async (
  options: FormatExecutorSchema,
  context: ExecutorContext
) => {
  const projectRoot = getProjectRoot(context)

  const args = ["run", "ruff", "format"]

  if (!options.fix) {
    args.push("--check")
  }

  if (options.preview) {
    args.push("--preview")
  }

  await runUv(args, { cwd: projectRoot })

  return { success: true }
}

export default runExecutor
