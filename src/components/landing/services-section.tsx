import { getTranslations } from "next-intl/server"
import { Section } from "@/components/ui/section"
import { FallbackBadge } from "@/components/ui/fallback-badge"
import type { Locale } from "@/i18n/routing"
import { getServices } from "@/lib/content/loaders"

export async function ServicesSection({ locale }: { locale: Locale }) {
  const t = await getTranslations("sections")
  const services = getServices(locale)

  return (
    <Section id="services" title={t("services")} subtitle={t("servicesSubtitle")}>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <li
            key={service.id}
            className="rounded-xl border border-line bg-surface p-6 transition-colors hover:border-primary/50"
          >
            <h3 className="font-semibold">
              {service.title}
              <FallbackBadge show={service.titleFallback} />
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {service.description}
              <FallbackBadge show={service.descriptionFallback} />
            </p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
