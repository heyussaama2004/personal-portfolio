import { z } from "zod";
import { localizedTextSchema } from "@/config/site";

export const projectCategorySchema = z.enum([
  "php-mysql",
  "web-development",
  "frontend-experiments",
  "ai-automation",
  "personal",
]);

export const skillLevelSchema = z.enum(["core", "working", "learning"]);

export const projectSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  summary: localizedTextSchema,
  category: projectCategorySchema,
  status: z.enum(["completed", "in-progress", "archived"]).default("completed"),
  featured: z.boolean().default(false),
  order: z.number().int().default(100),
  tags: z.array(z.string().min(1)).default([]),
  tech: z.array(z.string().min(1)).default([]),
  repoUrl: z.string().url().optional(),
  liveUrl: z.string().url().optional(),
  cover: z.string().optional(),
  gallery: z.array(z.string()).default([]),
  date: z.string().optional(),
  role: z.string().optional(),
  highlights: z.array(localizedTextSchema).default([]),
  body: z.string().optional(),
});

export type Project = z.infer<typeof projectSchema>;

export const serviceSchema = z.object({
  id: z.enum(["website", "business", "webapp", "backend", "automation", "api"]),
  title: localizedTextSchema,
  description: localizedTextSchema,
  order: z.number().int().default(100),
});

export type Service = z.infer<typeof serviceSchema>;

export const skillGroupSchema = z.object({
  id: z.enum(["frontend", "backend", "databases", "ai", "tools"]),
  title: localizedTextSchema,
  skills: z.array(
    z.object({
      name: z.string().min(1),
      level: skillLevelSchema,
    }),
  ),
  order: z.number().int().default(100),
});

export type SkillGroup = z.infer<typeof skillGroupSchema>;

export const experienceSchema = z.object({
  id: z.string().min(1),
  title: localizedTextSchema,
  organization: localizedTextSchema,
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: localizedTextSchema.optional(),
  order: z.number().int().default(100),
});

export type Experience = z.infer<typeof experienceSchema>;

export const testimonialSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  company: z.string().min(1),
  quote: z.string().min(1),
  link: z.string().url().optional(),
  consent: z.boolean().default(false),
});

export const certificationSchema = z.object({
  title: z.string().min(1),
  issuer: z.string().min(1),
  date: z.string().min(1),
  credentialUrl: z.string().url().optional(),
});

export const metricSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  source: z.string().min(1),
});

export const proofCollectionsSchema = z.object({
  testimonials: z.array(testimonialSchema).default([]),
  certifications: z.array(certificationSchema).default([]),
  metrics: z.array(metricSchema).default([]),
});

export type ProofCollections = z.infer<typeof proofCollectionsSchema>;
