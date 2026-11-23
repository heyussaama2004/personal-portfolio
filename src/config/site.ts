import { z } from "zod"

const localeSchema = z.enum(["en", "fr", "ar"])

export const localizedTextSchema = z.object({
  en: z.string().optional(),
  fr: z.string().optional(),
  ar: z.string().optional(),
})

const socialsSchema = z.object({
  github: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  instagram: z.string().url().optional(),
  youtube: z.string().url().optional(),
  x: z.string().url().optional(),
  other: z
    .array(
      z.object({
        label: z.string().min(1),
        url: z.string().url(),
        icon: z.string().optional(),
      }),
    )
    .default([]),
})

const contactSchema = z.object({
  email: z.string().email().optional(),
  whatsapp: z
    .object({
      number: z.string().optional(),
      approved: z.boolean(),
    })
    .default({ approved: false }),
  contactFormEnabled: z.boolean(),
})

const cvSchema = z.object({
  en: z.string().optional(),
  fr: z.string().optional(),
  ar: z.string().optional(),
})

const brandingSchema = z.object({
  logo: z.string().optional(),
  photo: z.string().optional(),
  accent: z.object({
    primary: z.string().min(1),
    secondary: z.string().min(1),
  }),
})

const analyticsSchema = z.object({
  provider: z.enum(["none", "vercel", "umami", "plausible"]),
  enabled: z.boolean(),
})

export const siteConfigSchema = z.object({
  owner: z.object({
    name: z.string().min(1),
    monogram: z.string().min(1).max(3),
    headline: localizedTextSchema,
    bio: localizedTextSchema,
    location: z.string().min(1),
    availability: z.object({
      jobs: z.boolean(),
      freelance: z.boolean(),
      remote: z.boolean(),
    }),
  }),
  socials: socialsSchema,
  contact: contactSchema,
  cv: cvSchema,
  branding: brandingSchema,
  analytics: analyticsSchema,
  site: z.object({
    url: z.string().url(),
    defaultLocale: localeSchema,
    ogImage: z.string().optional(),
  }),
})

export type SiteConfig = z.infer<typeof siteConfigSchema>
export type LocalizedText = z.infer<typeof localizedTextSchema>

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

export const siteConfig: SiteConfig = siteConfigSchema.parse({
  owner: {
    name: "Ussama",
    monogram: "OL",
    headline: {
      en: "Full-stack developer building web applications and automation in Morocco.",
      fr: "Développeur full-stack qui crée des applications web et de l'automatisation au Maroc.",
      ar: "مطوّر متكامل يبني تطبيقات ويب وأتمتة في المغرب.",
    },
    bio: {
      en: "I build practical web software for businesses and teams. My focus is clear interfaces, reliable backends and automation that saves real time.",
      fr: "Je crée des logiciels web pratiques pour les entreprises et les équipes. Je privilégie des interfaces claires, des backends fiables et une automatisation utile.",
      ar: "أبني برمجيات ويب عملية للشركات والفرق، مع تركيز على واجهات واضحة وخلفية موثوقة وأتمتة توفر وقتًا حقيقيًا.",
    },
    location: "Laâyoune, Morocco",
    availability: {
      jobs: true,
      freelance: true,
      remote: true,
    },
  },
  socials: {
    github: undefined,
    linkedin: undefined,
    instagram: undefined,
    youtube: undefined,
    x: undefined,
    other: [],
  },
  contact: {
    email: undefined,
    whatsapp: { number: undefined, approved: false },
    contactFormEnabled: Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL),
  },
  cv: {},
  branding: {
    logo: undefined,
    photo: undefined,
    accent: { primary: "#3B82F6", secondary: "#8B5CF6" },
  },
  analytics: { provider: "none", enabled: false },
  site: { url: siteUrl, defaultLocale: "en" },
})
