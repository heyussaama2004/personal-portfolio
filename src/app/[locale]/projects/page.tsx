import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { SiteFooter } from "@/components/landing/site-footer"
import { SiteHeader } from "@/components/landing/site-header"
import { ProjectsBrowser } from "@/components/projects/projects-browser"
import { JsonLd } from "@/components/seo/json-ld"
import { siteConfig } from "@/config/site"
import { isLocale } from "@/i18n/routing"
import { getProjectCover, getProjects } from "@/lib/content/projects"
import { buildJsonLd, buildMetadata } from "@/lib/seo"

type PageProps = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = await getTranslations({ locale, namespace: "nav" })

  return buildMetadata({
    locale,
    path: "/projects",
    title: t("projects"),
    description: siteConfig.owner.headline[locale] ?? siteConfig.owner.headline.en,
  })
}

export default async function ProjectsPage({ params }: PageProps) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const t = await getTranslations({ locale, namespace: "nav" })
  const projects = getProjects()
  const covers = Object.fromEntries(
    projects.map((project) => [project.slug, getProjectCover(project)]),
  )

  return (
    <>
      <JsonLd
        data={buildJsonLd({
          config: siteConfig,
          locale,
          path: "/projects",
          breadcrumbs: [
            { name: t("home"), path: "/" },
            { name: t("projects"), path: "/projects" },
          ],
        })}
      />
      <SiteHeader locale={locale} />
      <main
        id="main"
        tabIndex={-1}
        className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-24"
      >
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t("projects")}</h1>
        <ProjectsBrowser projects={projects} covers={covers} locale={locale} />
      </main>
      <SiteFooter />
    </>
  )
}
