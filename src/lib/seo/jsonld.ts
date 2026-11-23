import type { SiteConfig, LocalizedText } from "@/config/site"
import { routing, type Locale } from "@/i18n/routing"
import { configuredSocials, canShowEmail } from "@/lib/config/visibility"
import { absoluteUrl, localePath } from "./metadata"

type JsonLdValue = Record<string, unknown>
type Breadcrumb = { name: string; path: string }
type BuildJsonLdOptions = {
  config: SiteConfig
  locale: Locale
  path: string
  breadcrumbs?: Breadcrumb[]
}

function localizedText(text: LocalizedText, locale: Locale): string | undefined {
  return text[locale] || text.en || undefined
}

export function buildJsonLd({
  config,
  locale,
  path,
  breadcrumbs,
}: BuildJsonLdOptions): JsonLdValue[] {
  const siteUrl = config.site.url
  const personId = `${siteUrl.replace(/\/+$/, "")}/#person`
  const description =
    localizedText(config.owner.bio, locale) || localizedText(config.owner.headline, locale)
  const sameAs = configuredSocials(config).map((social) => social.url)

  const person: JsonLdValue = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId,
    name: config.owner.name,
    alternateName: config.owner.monogram,
    url: absoluteUrl(localePath(locale, path), siteUrl),
  }

  if (description) person.description = description
  if (config.branding.photo) person.image = absoluteUrl(config.branding.photo, siteUrl)
  if (canShowEmail(config) && config.contact.email) person.email = config.contact.email
  if (sameAs.length > 0) person.sameAs = sameAs

  const website: JsonLdValue = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: config.owner.name,
    url: absoluteUrl("/", siteUrl),
    inLanguage: routing.locales,
    publisher: { "@id": personId },
  }

  const graph = [person, website]

  if (breadcrumbs && breadcrumbs.length > 0) {
    graph.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: absoluteUrl(localePath(locale, crumb.path), siteUrl),
      })),
    })
  }

  return graph
}
