import { describe, expect, it } from "vitest"
import { getExperience, getProof, getServices, getSkills, localize } from "@/lib/content/loaders"

describe("localize", () => {
  it("returns the requested locale value", () => {
    expect(localize({ en: "Hello", fr: "Bonjour" }, "fr")).toEqual({
      value: "Bonjour",
      fallbackUsed: false,
      missing: false,
    })
  })

  it("falls back to English and marks the fallback", () => {
    expect(localize({ en: "Hello" }, "ar")).toEqual({
      value: "Hello",
      fallbackUsed: true,
      missing: false,
    })
  })

  it("marks a value as missing when no locale has content", () => {
    expect(localize({}, "fr")).toEqual({
      value: "",
      fallbackUsed: false,
      missing: true,
    })
  })
})

describe("content loaders", () => {
  it("loads the six services in order", () => {
    const services = getServices("en")
    expect(services).toHaveLength(6)
    expect(services[0]?.id).toBe("website")
    expect(services.every((service) => service.title.length > 0)).toBe(true)
  })

  it("loads skill groups with localized titles", () => {
    const groups = getSkills("fr")
    expect(groups.map((group) => group.id)).toEqual([
      "frontend",
      "backend",
      "databases",
      "ai",
      "tools",
    ])
    expect(groups[0]?.title).not.toBe("")
  })

  it("loads experience without inventing dates", () => {
    const experience = getExperience("en")
    expect(experience).toHaveLength(3)
    expect(experience.every((item) => item.startDate === undefined)).toBe(true)
  })

  it("returns empty proof collections by default", () => {
    expect(getProof()).toEqual({ testimonials: [], certifications: [], metrics: [] })
  })
})
