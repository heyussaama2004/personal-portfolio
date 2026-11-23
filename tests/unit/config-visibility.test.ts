import { describe, expect, it } from "vitest"
import {
  availableCvLocales,
  canShowEmail,
  canShowWhatsapp,
  configuredSocials,
  hasProofEntries,
  isDirectContactConfigured,
} from "@/lib/config/visibility"

const baseConfig = {
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
    contactFormEnabled: false,
  },
  cv: {},
}

describe("configuredSocials", () => {
  it("returns nothing when every social is unconfigured", () => {
    expect(configuredSocials(baseConfig as never)).toEqual([])
  })

  it("returns only platforms that have a URL", () => {
    const config = {
      ...baseConfig,
      socials: { ...baseConfig.socials, github: "https://github.com/example", x: undefined },
    }
    expect(configuredSocials(config as never)).toEqual([
      { key: "github", label: "github", url: "https://github.com/example" },
    ])
  })

  it("includes custom social links", () => {
    const config = {
      ...baseConfig,
      socials: {
        ...baseConfig.socials,
        other: [{ label: "Stack Overflow", url: "https://stackoverflow.com/users/1" }],
      },
    }
    expect(configuredSocials(config as never)).toHaveLength(1)
  })
})

describe("contact visibility", () => {
  it("hides WhatsApp when no number is configured", () => {
    expect(canShowWhatsapp(baseConfig as never)).toBe(false)
  })

  it("hides WhatsApp when a number exists but is not approved", () => {
    const config = {
      ...baseConfig,
      contact: { ...baseConfig.contact, whatsapp: { number: "+212600000000", approved: false } },
    }
    expect(canShowWhatsapp(config as never)).toBe(false)
  })

  it("shows WhatsApp only when a number is approved", () => {
    const config = {
      ...baseConfig,
      contact: { ...baseConfig.contact, whatsapp: { number: "+212600000000", approved: true } },
    }
    expect(canShowWhatsapp(config as never)).toBe(true)
  })

  it("hides email when unconfigured", () => {
    expect(canShowEmail(baseConfig as never)).toBe(false)
  })

  it("reports direct contact as unconfigured when every channel is absent", () => {
    expect(isDirectContactConfigured(baseConfig as never)).toBe(false)
  })

  it("reports direct contact as configured when the form is enabled", () => {
    const config = {
      ...baseConfig,
      contact: { ...baseConfig.contact, contactFormEnabled: true },
    }
    expect(isDirectContactConfigured(config as never)).toBe(true)
  })
})

describe("availableCvLocales", () => {
  it("returns an empty list when no CV files are configured", () => {
    expect(availableCvLocales(baseConfig as never)).toEqual([])
  })

  it("returns only locales that have a CV path", () => {
    const config = { ...baseConfig, cv: { en: "/cv/en.pdf", ar: "/cv/ar.pdf" } }
    expect(availableCvLocales(config as never)).toEqual(["en", "ar"])
  })
})

describe("hasProofEntries", () => {
  it("is false for empty proof collections", () => {
    expect(hasProofEntries({ testimonials: [], certifications: [], metrics: [] })).toBe(false)
  })

  it("is true when any verified entry exists", () => {
    expect(
      hasProofEntries({
        testimonials: [],
        certifications: [{ title: "Example", issuer: "Example", date: "2024" }],
        metrics: [],
      }),
    ).toBe(true)
  })
})
