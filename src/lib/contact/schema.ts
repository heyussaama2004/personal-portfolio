import { projectTypeSchema } from "@/content/schemas"
import { z } from "zod"

export function sanitizeText(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/[\u0000-\u001F\u007F<>]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

const clean = (schema: z.ZodString) =>
  z.preprocess((value) => (typeof value === "string" ? sanitizeText(value) : value), schema)

export const quoteSchema = z.object({
  name: clean(z.string().min(2).max(80)),
  email: clean(z.string().email().max(160)),
  projectType: projectTypeSchema,
  budget: clean(z.string().max(80)).optional(),
  timeline: clean(z.string().max(80)).optional(),
  message: clean(z.string().min(20).max(4000)),
  consent: z.literal(true),
  website: clean(z.string().max(200)).optional(),
  startedAt: z.number().int().positive(),
})

export type QuoteSubmission = z.infer<typeof quoteSchema>

export const MIN_SUBMIT_MS = 1000

export function isHumanSubmission(
  input: Pick<QuoteSubmission, "website" | "startedAt">,
  now = Date.now(),
): boolean {
  return !input.website && now - input.startedAt >= MIN_SUBMIT_MS
}
