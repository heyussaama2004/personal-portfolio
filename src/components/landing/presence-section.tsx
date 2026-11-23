import { Code2, Globe, Link2, type LucideIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Section } from "@/components/ui/section"
import { siteConfig } from "@/config/site"
import { configuredSocials } from "@/lib/config/visibility"

const icons: Record<string, LucideIcon> = {
  github: Code2,
  linkedin: Globe,
  instagram: Globe,
  youtube: Globe,
  x: Globe,
  other: Link2,
}

export async function PresenceSection() {
  const t = await getTranslations("sections")
  const socials = configuredSocials(siteConfig)

  if (socials.length === 0) return null

  return (
    <Section id="presence" title={t("presence")}>
      <ul className="flex flex-wrap gap-3">
        {socials.map((social) => {
          const Icon: LucideIcon = icons[social.key] ?? Link2
          return (
            <li key={social.key}>
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2 text-sm transition-colors hover:text-primary"
              >
                <Icon aria-hidden="true" size={16} />
                {social.label}
              </a>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
