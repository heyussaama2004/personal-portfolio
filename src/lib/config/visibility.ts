import type { SiteConfig } from "@/config/site"
import type { ProofCollections } from "@/content/schemas"
import type { Locale } from "@/i18n/routing"

const SOCIAL_KEYS = ["github", "linkedin", "instagram", "youtube", "x"] as const

export type SocialEntry = {
  key: string
  label: string
  url: string
}

export function configuredSocials(config: SiteConfig): SocialEntry[] {
  const entries: SocialEntry[] = []

  for (const key of SOCIAL_KEYS) {
    const url = config.socials[key]
    if (url) entries.push({ key, label: key, url })
  }

  for (const item of config.socials.other) {
    entries.push({ key: `other:${item.label}`, label: item.label, url: item.url })
  }

  return entries
}

export function availableCvLocales(config: SiteConfig): Locale[] {
  return (["en", "fr", "ar"] as const).filter((locale) => Boolean(config.cv[locale]))
}

export function canShowWhatsapp(config: SiteConfig): boolean {
  return Boolean(config.contact.whatsapp.number && config.contact.whatsapp.approved)
}

export function canShowEmail(config: SiteConfig): boolean {
  return Boolean(config.contact.email)
}

export function isDirectContactConfigured(config: SiteConfig): boolean {
  return config.contact.contactFormEnabled || canShowEmail(config) || canShowWhatsapp(config)
}

export function hasProofEntries(proof: ProofCollections): boolean {
  return (
    proof.testimonials.length > 0 || proof.certifications.length > 0 || proof.metrics.length > 0
  )
}
