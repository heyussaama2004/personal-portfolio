import { Mail, MessageCircle } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { getTranslations } from "next-intl/server"
import { Section } from "@/components/ui/section"
import { siteConfig } from "@/config/site"
import { canShowEmail, canShowWhatsapp, isDirectContactConfigured } from "@/lib/config/visibility"

export async function ContactSection() {
  const t = await getTranslations("contact")
  const configured = isDirectContactConfigured(siteConfig)
  const email = canShowEmail(siteConfig) ? siteConfig.contact.email : undefined
  const number = canShowWhatsapp(siteConfig) ? siteConfig.contact.whatsapp.number : undefined

  return (
    <Section id="contact" title={t("title")} subtitle={t("description")}>
      {configured ? (
        <div className="flex flex-wrap gap-3">
          {email ? (
            <a
              href={`mailto:${email}`}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 font-medium text-background"
            >
              <Mail aria-hidden="true" size={17} />
              {email}
            </a>
          ) : null}
          {number ? (
            <a
              href={`https://wa.me/${number.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-line bg-surface px-5 font-medium transition-colors hover:text-primary"
            >
              <MessageCircle aria-hidden="true" size={17} />
              WhatsApp
            </a>
          ) : null}
        </div>
      ) : (
        <p className="max-w-2xl rounded-xl border border-dashed border-line bg-surface p-6 text-sm text-muted">
          {t("unconfigured")}
        </p>
      )}
      <Link
        href="/quote"
        className="mt-6 inline-flex h-11 items-center rounded-lg border border-line bg-surface px-5 text-sm font-medium transition-colors hover:text-primary"
      >
        {t("openForm")}
      </Link>
    </Section>
  )
}
