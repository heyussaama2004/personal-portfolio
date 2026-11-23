import type { LocalizedText } from "@/config/site"
import type { Locale } from "@/i18n/routing"
import { experience } from "@/content/experience"
import { proof } from "@/content/proof"
import { services } from "@/content/services"
import { skillGroups } from "@/content/skills"
import type { ProofCollections, Service, SkillGroup } from "@/content/schemas"

export type LocalizedValue = {
  value: string
  fallbackUsed: boolean
  missing: boolean
}

export function localize(text: LocalizedText, locale: Locale): LocalizedValue {
  const requested = text[locale]
  if (requested) return { value: requested, fallbackUsed: false, missing: false }

  const english = text.en
  if (english) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[i18n] Missing ${locale} translation, falling back to English.`)
    }
    return { value: english, fallbackUsed: true, missing: false }
  }

  return { value: "", fallbackUsed: false, missing: true }
}

export type LocalizedService = {
  id: Service["id"]
  title: string
  description: string
  titleFallback: boolean
  descriptionFallback: boolean
  order: number
}

export function getServices(locale: Locale): LocalizedService[] {
  return [...services]
    .sort((a, b) => a.order - b.order)
    .map((service) => {
      const title = localize(service.title, locale)
      const description = localize(service.description, locale)
      return {
        id: service.id,
        title: title.value,
        description: description.value,
        titleFallback: title.fallbackUsed,
        descriptionFallback: description.fallbackUsed,
        order: service.order,
      }
    })
}

export type LocalizedSkillGroup = {
  id: SkillGroup["id"]
  title: string
  titleFallback: boolean
  skills: SkillGroup["skills"]
  order: number
}

export function getSkills(locale: Locale): LocalizedSkillGroup[] {
  return [...skillGroups]
    .sort((a, b) => a.order - b.order)
    .map((group) => {
      const title = localize(group.title, locale)
      return {
        id: group.id,
        title: title.value,
        titleFallback: title.fallbackUsed,
        skills: group.skills,
        order: group.order,
      }
    })
}

export type LocalizedExperience = {
  id: string
  title: string
  organization: string
  location?: string
  startDate?: string
  endDate?: string
  description?: string
  order: number
}

export function getExperience(locale: Locale): LocalizedExperience[] {
  return [...experience]
    .sort((a, b) => a.order - b.order)
    .map((item) => {
      const title = localize(item.title, locale)
      const organization = localize(item.organization, locale)
      const description = item.description ? localize(item.description, locale) : undefined
      return {
        id: item.id,
        title: title.value,
        organization: organization.value,
        location: item.location,
        startDate: item.startDate,
        endDate: item.endDate,
        description: description?.value,
        order: item.order,
      }
    })
}

export function getProof(): ProofCollections {
  return proof
}
