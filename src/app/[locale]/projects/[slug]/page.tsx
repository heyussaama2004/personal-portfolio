import type { Metadata } from "next"
import Image from "next/image"
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { FallbackBadge } from "@/components/ui/fallback-badge"
import { SiteFooter } from "@/components/landing/site-footer"
import { SiteHeader } from "@/components/landing/site-header"
import { GeneratedCover } from "@/components/projects/generated-cover"
import { JsonLd } from "@/components/seo/json-ld"
import { siteConfig } from "@/config/site"
import { Link } from "@/i18n/navigation"
import { isLocale, routing } from "@/i18n/routing"
import { localize } from "@/lib/content/loaders"
import {
  getProjectBySlug,
  getProjectCover,
  getProjectGallery,
  getProjects,
} from "@/lib/content/projects"
import { buildJsonLd, buildMetadata } from "@/lib/seo"

type PageProps = { params: Promise<{ locale: string; slug: string }> }

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getProjects().map((project) => ({ locale, slug: project.slug })),
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()

  const project = getProjectBySlug(slug)
  if (!project) notFound()

  const description = localize(project.summary, locale).value

  return buildMetadata({
    locale,
    path: `/projects/${project.slug}`,
    title: project.title,
    description,
    type: "article",
  })
}

export default async function ProjectPage({ params }: PageProps) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()

  const project = getProjectBySlug(slug)
  if (!project) notFound()

  const t = await getTranslations({ locale, namespace: "projects" })
  const navT = await getTranslations({ locale, namespace: "nav" })
  const summary = localize(project.summary, locale)
  const cover = getProjectCover(project)
  const gallery = getProjectGallery(project)
  const configuredCoverAlt = project.coverAlt ? localize(project.coverAlt, locale).value : ""
  const coverLabel = configuredCoverAlt || t("coverAlt", { title: project.title })

  return (
    <>
      <JsonLd
        data={buildJsonLd({
          config: siteConfig,
          locale,
          path: `/projects/${project.slug}`,
          breadcrumbs: [
            { name: navT("home"), path: "/" },
            { name: navT("projects"), path: "/projects" },
            { name: project.title, path: `/projects/${project.slug}` },
          ],
        })}
      />
      <SiteHeader locale={locale} />
      <main
        id="main"
        tabIndex={-1}
        className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8 sm:py-16"
      >
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 rounded text-sm text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft aria-hidden="true" size={16} />
          {t("all")}
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <article>
            <div className="mb-6 overflow-hidden rounded-xl border border-line">
              {cover ? (
                <div className="relative h-64 sm:h-80">
                  <Image
                    src={cover}
                    alt={coverLabel}
                    fill
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <GeneratedCover title={project.title} label={coverLabel} />
              )}
            </div>

            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  {project.title}
                </h1>
                {project.featured ? (
                  <span className="rounded-full border border-line px-2 py-1 text-xs text-muted">
                    {t("featured")}
                  </span>
                ) : null}
                <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                  {t(`status.${project.status}`)}
                </span>
              </div>
              <p className="mt-4 max-w-2xl leading-relaxed text-muted">
                {summary.value}
                <FallbackBadge show={summary.fallbackUsed} />
              </p>
            </header>

            {project.highlights.length > 0 ? (
              <section className="mb-10">
                <h2 className="text-lg font-semibold">{t("details")}</h2>
                <ul className="mt-4 space-y-3">
                  {project.highlights.map((highlight, index) => {
                    const text = localize(highlight, locale)
                    return (
                      <li
                        key={index}
                        className="flex gap-3 text-sm leading-relaxed text-foreground/85"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                        />
                        <span>
                          {text.value}
                          <FallbackBadge show={text.fallbackUsed} />
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </section>
            ) : null}

            {gallery.length > 0 ? (
              <section className="mb-10">
                <h2 className="text-lg font-semibold">{t("gallery")}</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {gallery.map((asset, index) => {
                    const galleryAltText = project.galleryAlt[index]
                    const configuredAlt = galleryAltText
                      ? localize(galleryAltText, locale).value
                      : ""
                    const alt =
                      configuredAlt || t("galleryAlt", { title: project.title, number: index + 1 })

                    return (
                      <div
                        key={asset}
                        className="relative h-48 overflow-hidden rounded-lg border border-line"
                      >
                        <Image
                          src={asset}
                          alt={alt}
                          fill
                          sizes="(max-width: 640px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                    )
                  })}
                </div>
              </section>
            ) : null}

            <div className="flex flex-wrap gap-3">
              {project.repoUrl ? (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-lg border border-line bg-surface px-5 text-sm font-medium transition-colors hover:text-primary"
                >
                  <ExternalLink aria-hidden="true" size={16} />
                  {t("repo")}
                </a>
              ) : null}
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-lg border border-line bg-surface px-5 text-sm font-medium transition-colors hover:text-primary"
                >
                  <ArrowUpRight aria-hidden="true" size={16} />
                  {t("demo")}
                </a>
              ) : null}
            </div>
          </article>

          <aside className="h-fit space-y-6 rounded-xl border border-line bg-surface p-6">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">
                {t("category")}
              </h2>
              <p className="mt-2 text-sm">{t(`categories.${project.category}`)}</p>
            </div>
            {project.role ? (
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {t("role")}
                </h2>
                <p className="mt-2 text-sm">{project.role}</p>
              </div>
            ) : null}
            {project.tech.length > 0 ? (
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {t("stack")}
                </h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-line px-2 py-1 text-xs text-muted"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            <Link
              href={`/os?app=projects&project=${project.slug}`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-background"
            >
              <ArrowUpRight aria-hidden="true" size={16} />
              {t("openInOs")}
            </Link>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
