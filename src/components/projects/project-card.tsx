import { ArrowUpRight } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { FallbackBadge } from "@/components/ui/fallback-badge"
import type { Project } from "@/content/schemas"
import { Link } from "@/i18n/navigation"
import type { Locale } from "@/i18n/routing"
import { localize } from "@/lib/content/loaders"
import { GeneratedCover } from "./generated-cover"

export function ProjectCard({
  project,
  locale,
  cover,
  featuredLabel,
}: {
  project: Project
  locale: Locale
  cover?: string
  featuredLabel: string
}) {
  const summary = localize(project.summary, locale)
  const t = useTranslations("projects")
  const configuredCoverAlt = project.coverAlt ? localize(project.coverAlt, locale).value : ""
  const coverLabel = configuredCoverAlt || t("coverAlt", { title: project.title })

  return (
    <li className="group overflow-hidden rounded-xl border border-line bg-surface">
      <Link href={`/projects/${project.slug}`} className="block rounded-xl">
        {cover ? (
          <div className="relative h-40">
            <Image
              src={cover}
              alt={coverLabel}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          </div>
        ) : (
          <GeneratedCover title={project.title} label={coverLabel} />
        )}
        <div className="p-5">
          <h2 className="flex items-center text-base font-semibold">
            {project.title}
            {project.featured ? (
              <span className="ms-2 rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted">
                {featuredLabel}
              </span>
            ) : null}
            <ArrowUpRight
              aria-hidden="true"
              size={16}
              className="ms-auto text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {summary.value}
            <FallbackBadge show={summary.fallbackUsed} />
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tech.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-line px-2 py-1 text-xs text-muted"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </li>
  )
}
