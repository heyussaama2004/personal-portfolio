import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { SiteFooter } from "@/components/landing/site-footer"
import { SiteHeader } from "@/components/landing/site-header"
import { OsLoader } from "@/app/[locale]/os/os-loader"
import { siteConfig } from "@/config/site"
import { isLocale } from "@/i18n/routing"
import {
  availableCvLocales,
  canShowEmail,
  canShowWhatsapp,
  configuredSocials,
} from "@/lib/config/visibility"
import { getExperience, getSkills, localize } from "@/lib/content/loaders"
import { getProjects } from "@/lib/content/projects"
import type { OsData } from "@/lib/os/types"
import { buildMetadata } from "@/lib/seo"

type PageProps = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = await getTranslations({ locale, namespace: "os" })

  return buildMetadata({
    locale,
    path: "/os",
    title: t("title"),
    description: siteConfig.owner.headline[locale] ?? siteConfig.owner.headline.en,
    indexable: false,
  })
}

export default async function OsPage({ params }: PageProps) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = await getTranslations({ locale, namespace: "os" })

  const email = canShowEmail(siteConfig) ? siteConfig.contact.email : undefined
  const number = canShowWhatsapp(siteConfig) ? siteConfig.contact.whatsapp.number : undefined

  const data: OsData = {
    locale,
    owner: {
      name: siteConfig.owner.name,
      monogram: siteConfig.owner.monogram,
      location: siteConfig.owner.location,
      headline: localize(siteConfig.owner.headline, locale).value,
      bio: localize(siteConfig.owner.bio, locale).value,
    },
    projects: getProjects().map((project) => ({
      slug: project.slug,
      title: project.title,
      summary: localize(project.summary, locale).value,
      category: project.category,
      tags: project.tags,
      tech: project.tech,
      featured: project.featured,
    })),
    skills: getSkills(locale).map((group) => ({
      id: group.id,
      title: group.title,
      skills: group.skills,
    })),
    experience: getExperience(locale).map((item) => ({
      id: item.id,
      title: item.title,
      organization: item.organization,
      location: item.location,
      description: item.description,
    })),
    presence: configuredSocials(siteConfig),
    contact: {
      email,
      whatsapp: number,
      formEnabled: siteConfig.contact.contactFormEnabled,
      configured: siteConfig.contact.contactFormEnabled || Boolean(email || number),
    },
    cvLocales: availableCvLocales(siteConfig),
  }

  return (
    <>
      <SiteHeader locale={locale} />
      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-[1600px] px-3 py-6 sm:px-6">
        <h1 className="sr-only">{t("title")}</h1>
        <OsLoader data={data} />
      </main>
      <SiteFooter />
    </>
  )
}
