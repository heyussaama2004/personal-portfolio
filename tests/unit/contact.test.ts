import { afterEach, describe, expect, it, vi } from "vitest"
import {
  createContactProvider,
  createRateLimit,
  isHumanSubmission,
  quoteSchema,
  sanitizeText,
} from "@/lib/contact"
import type { QuoteSubmission } from "@/lib/contact"

const validInput: QuoteSubmission = {
  name: "Ussama",
  email: "hello@example.com",
  projectType: "webapp",
  budget: "500-1000",
  timeline: "flexible",
  message: "I need a responsive web application with a clear contact flow.",
  consent: true,
  website: "",
  startedAt: Date.now() - 5000,
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("quote validation", () => {
  it("accepts a complete submission", () => {
    const result = quoteSchema.safeParse(validInput)
    expect(result.success).toBe(true)
  })

  it("rejects invalid email, missing consent and unknown project types", () => {
    expect(quoteSchema.safeParse({ ...validInput, email: "not-an-email" }).success).toBe(false)
    expect(quoteSchema.safeParse({ ...validInput, consent: false }).success).toBe(false)
    expect(quoteSchema.safeParse({ ...validInput, projectType: "unknown" }).success).toBe(false)
  })

  it("sanitizes control characters and markup", () => {
    expect(sanitizeText("Hello\x00 <b>world</b>\n again")).toBe("Hello world again")
  })

  it("rejects honeypot and too-fast submissions", () => {
    const now = Date.now()
    expect(isHumanSubmission({ ...validInput, website: "spam" }, now)).toBe(false)
    expect(isHumanSubmission({ ...validInput, startedAt: now }, now)).toBe(false)
    expect(isHumanSubmission(validInput, now)).toBe(true)
  })
})

describe("contact provider", () => {
  it("uses the disabled fallback without email environment variables", async () => {
    const provider = createContactProvider({})
    await expect(provider.send(validInput)).resolves.toEqual({ ok: false, code: "disabled" })
  })

  it("posts a sanitized plain-text message through Resend", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }))
    vi.stubGlobal("fetch", fetchMock)

    const provider = createContactProvider({
      RESEND_API_KEY: "re_test",
      CONTACT_TO_EMAIL: "owner@example.com",
      CONTACT_FROM_EMAIL: "site@example.com",
    })
    const result = await provider.send({
      ...validInput,
      message: "Hello\x00 <b>world</b>",
    })

    expect(result).toEqual({ ok: true })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe("https://api.resend.com/emails")
    expect(options.headers).toMatchObject({ Authorization: "Bearer re_test" })
    expect(String(options.body)).toContain("Hello world")
    expect(String(options.body)).not.toContain("<b>")
  })
})

describe("rate limit", () => {
  it("allows up to the limit, then blocks until the window expires", () => {
    const limit = createRateLimit(2, 1000)
    expect(limit.check("127.0.0.1", 0)).toBe(true)
    expect(limit.check("127.0.0.1", 100)).toBe(true)
    expect(limit.check("127.0.0.1", 200)).toBe(false)
    expect(limit.check("127.0.0.1", 1100)).toBe(true)
  })
})
