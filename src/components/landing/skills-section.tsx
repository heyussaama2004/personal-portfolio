import { getTranslations } from "next-intl/server"
import { Section } from "@/components/ui/section"
import { FallbackBadge } from "@/components/ui/fallback-badge"
import type { Locale } from "@/i18n/routing"
import { getSkills } from "@/lib/content/loaders"

export async function SkillsSection({ locale }: { locale: Locale }) {
  const t = await getTranslations("sections")
  const levels = await getTranslations("skills")
  const groups = getSkills(locale)

  return (
    <Section id="skills" title={t("skills")}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <div key={group.id} className="rounded-xl border border-line bg-surface p-6">
            <h3 className="font-semibold">
              {group.title}
              <FallbackBadge show={group.titleFallback} />
            </h3>
            <ul className="mt-4 space-y-2">
              {group.skills.map((skill) => (
                <li key={skill.name} className="flex items-center justify-between gap-3 text-sm">
                  <span>{skill.name}</span>
                  <span className="rounded-full border border-line px-2 py-0.5 text-xs text-muted">
                    {levels(skill.level)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
