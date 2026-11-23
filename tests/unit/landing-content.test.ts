import { describe, expect, it } from "vitest"
import ar from "@/i18n/messages/ar.json"
import en from "@/i18n/messages/en.json"
import fr from "@/i18n/messages/fr.json"
import { routing } from "@/i18n/routing"
import { getExperience, getServices, getSkills } from "@/lib/content/loaders"

const catalogs = { en, fr, ar }

describe("landing content", () => {
  it("provides localized text for every service, skill group and experience entry", () => {
    for (const locale of routing.locales) {
      for (const service of getServices(locale)) {
        expect(service.title.length).toBeGreaterThan(0)
        expect(service.description.length).toBeGreaterThan(0)
      }
      for (const group of getSkills(locale)) {
        expect(group.title.length).toBeGreaterThan(0)
        expect(group.skills.length).toBeGreaterThan(0)
      }
      for (const item of getExperience(locale)) {
        expect(item.title.length).toBeGreaterThan(0)
        expect(item.organization.length).toBeGreaterThan(0)
      }
    }
  })

  it("keeps shared UI keys in every locale catalog", () => {
    for (const locale of routing.locales) {
      const catalog = catalogs[locale]
      expect(catalog.common.skipToContent.length).toBeGreaterThan(0)
      expect(catalog.hero.primary.length).toBeGreaterThan(0)
      expect(catalog.sections.contact.length).toBeGreaterThan(0)
      expect(catalog.contact.unconfigured.length).toBeGreaterThan(0)
      expect(catalog.footer.privacy.length).toBeGreaterThan(0)
    }
  })
})
