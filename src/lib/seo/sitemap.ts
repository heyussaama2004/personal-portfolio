import type { MetadataRoute } from "next";
import type { SiteConfig } from "@/config/site";
import { routing, type Locale } from "@/i18n/routing";
import { getProjects } from "@/lib/content/projects";
import { absoluteUrl, localePath } from "./metadata";

function parseLastModified(value: string | undefined): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function buildSitemapEntries(config: SiteConfig): MetadataRoute.Sitemap {
  const projects = getProjects();
  const paths = [
    "/",
    "/projects",
    "/privacy",
    ...projects.map((project) => `/projects/${project.slug}`),
  ];

  return routing.locales.flatMap((locale: Locale) =>
    paths.map((path) => {
      const project = projects.find((item) => `/projects/${item.slug}` === path);
      const languages: Record<string, string> = {};

      for (const item of routing.locales) {
        languages[item] = absoluteUrl(localePath(item, path), config.site.url);
      }
      languages["x-default"] = absoluteUrl(
        localePath(routing.defaultLocale, path),
        config.site.url,
      );

      return {
        url: absoluteUrl(localePath(locale, path), config.site.url),
        lastModified: parseLastModified(project?.date),
        changeFrequency: path === "/" ? "monthly" : "yearly",
        priority: path === "/" ? 1 : path === "/projects" ? 0.8 : 0.6,
        alternates: { languages },
      } satisfies MetadataRoute.Sitemap[number];
    }),
  );
}
