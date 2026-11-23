import type { Locale } from "@/i18n/routing"
import type { WindowAppId } from "@/lib/os/window-manager/types"

export type OsProject = {
  slug: string
  title: string
  summary: string
  category: string
  tags: string[]
  tech: string[]
  featured: boolean
}

export type OsSkillGroup = {
  id: string
  title: string
  skills: { name: string; level: "core" | "working" | "learning" }[]
}

export type OsExperienceEntry = {
  id: string
  title: string
  organization: string
  location?: string
  description?: string
}

export type OsPresenceLink = { label: string; url: string }

export type OsData = {
  locale: Locale
  owner: {
    name: string
    monogram: string
    location: string
    headline: string
    bio: string
  }
  projects: OsProject[]
  skills: OsSkillGroup[]
  experience: OsExperienceEntry[]
  presence: OsPresenceLink[]
  contact: {
    email?: string
    whatsapp?: string
    formEnabled: boolean
    configured: boolean
  }
  cvLocales: Locale[]
}

export type AppDefinition = {
  id: WindowAppId
  label: string
}
