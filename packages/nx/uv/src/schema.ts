import { z } from "zod"

export interface PluginOptions {
  buildTargetName?: string
}

export const PyProjectSchema = z.object({
  project: z.object({
    name: z.string(),
    version: z.string(),
    dependencies: z.array(z.string()).optional().default([]),
  }),

  "build-system": z.object({
    "build-backend": z.string().optional(),
  }).optional().default({}),

  tool: z
    .object({
      uv: z
        .object({
          sources: z
            .record(
              z.object({
                workspace: z.boolean().optional().default(false),
              })
            )
            .optional()
            .default({}),
        })
        .optional()
        .default({}),
    })
    .optional()
    .default({}),

  "dependency-groups": z.record(z.array(z.string())).optional().default({}),
})

export type PyProject = z.infer<typeof PyProjectSchema>
