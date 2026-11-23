import { sanitizeText, type QuoteSubmission } from "./schema"

type Env = Record<string, string | undefined>

export type ContactResult = { ok: true } | { ok: false; code: "disabled" | "provider_error" }

export type ContactProvider = {
  send: (input: QuoteSubmission) => Promise<ContactResult>
}

const disabledProvider: ContactProvider = {
  async send() {
    return { ok: false, code: "disabled" }
  },
}

function createResendProvider(env: Env): ContactProvider {
  const apiKey = env.RESEND_API_KEY
  const toEmail = env.CONTACT_TO_EMAIL
  const fromEmail = env.CONTACT_FROM_EMAIL ?? toEmail

  if (!apiKey || !toEmail || !fromEmail) return disabledProvider

  return {
    async send(input) {
      const text = [
        `Name: ${sanitizeText(input.name)}`,
        `Email: ${sanitizeText(input.email)}`,
        `Project type: ${input.projectType}`,
        `Budget: ${sanitizeText(input.budget ?? "")}`,
        `Timeline: ${sanitizeText(input.timeline ?? "")}`,
        "",
        sanitizeText(input.message),
      ].join("\n")

      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [toEmail],
            subject: `Quote request: ${input.projectType}`,
            text,
          }),
        })
        return response.ok ? { ok: true } : { ok: false, code: "provider_error" }
      } catch {
        return { ok: false, code: "provider_error" }
      }
    },
  }
}

export function createContactProvider(env: Env = process.env): ContactProvider {
  if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL) return disabledProvider
  return createResendProvider(env)
}
