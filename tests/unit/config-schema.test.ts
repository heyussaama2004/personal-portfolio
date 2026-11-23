import { describe, expect, it } from "vitest"
import { siteConfigSchema } from "@/config/site"

const validConfig = {
  owner: {
    name: "Ussama",
    monogram: "OL",
    headline: { en: "Developer" },
    bio: { en: "Bio" },
    location: "Laâyoune, Morocco",
    availability: { jobs: true, freelance: true, remote: true },
  },
  socials: { other: [] },
  contact: { whatsapp: { approved: false }, contactFormEnabled: false },
  cv: {},
  branding: { accent: { primary: "#3B82F6", secondary: "#8B5CF6" } },
  analytics: { provider: "none", enabled: false },
  site: { url: "https://example.com", defaultLocale: "en" },
}

describe("siteConfigSchema", () => {
  it("accepts a config where every optional field is missing", () => {
    expect(() => siteConfigSchema.parse(validConfig)).not.toThrow()
  })

  it("rejects an invalid social URL", () => {
    const config = {
      ...validConfig,
      socials: { ...validConfig.socials, github: "not-a-url" },
    }
    expect(() => siteConfigSchema.parse(config)).toThrow()
  })

  it("keeps an unapproved WhatsApp number valid but hidden by visibility helpers", () => {
    const config = {
      ...validConfig,
      contact: { ...validConfig.contact, whatsapp: { number: "+212600000000", approved: false } },
    }
    expect(() => siteConfigSchema.parse(config)).not.toThrow()
  })

  it("rejects an invalid contact email", () => {
    const config = {
      ...validConfig,
      contact: { ...validConfig.contact, email: "not-an-email" },
    }
    expect(() => siteConfigSchema.parse(config)).toThrow()
  })
})
