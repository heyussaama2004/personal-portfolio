import { getTranslations } from "next-intl/server"
import { Section } from "@/components/ui/section"
import type { Locale } from "@/i18n/routing"
import { getExperience } from "@/lib/content/loaders"

export async function ExperienceSection({ locale }: { locale: Locale }) {
  const t = await getTranslations("sections")
  const items = getExperience(locale)

  return (
    <Section id="experience" title={t("experience")}>
      <ol className="relative border-s border-line ps-6">
        {items.map((item) => (
          <li key={item.id} className="relative pb-8 last:pb-0">
            <span
              aria-hidden="true"
              className="absolute -start-[31px] top-1 h-3 w-3 rounded-full border-2 border-background bg-primary"
            />
            <h3 className="font-semibold">{item.title}</h3>
            <p className="mt-1 text-sm text-foreground/80">{item.organization}</p>
            {item.location ? <p className="mt-1 text-xs text-muted">{item.location}</p> : null}
            {item.description ? (
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                {item.description}
              </p>
            ) : null}
          </li>
        ))}
      </ol>
    </Section>
  )
}
