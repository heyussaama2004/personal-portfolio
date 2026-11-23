import type { MetadataRoute } from "next"
import { siteConfig } from "@/config/site"
import { buildSitemapEntries } from "@/lib/seo"

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemapEntries(siteConfig)
}
