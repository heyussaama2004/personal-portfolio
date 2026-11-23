import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";

type BuildMetadataOptions = {
  locale: Locale;
  path: string;
  title: string;
  description?: string;
  type?: "website" | "article";
  indexable?: boolean;
  images?: string | string[];
};

function normalizePath(path: string): string {
  if (!path || path === "/") return "";
  return path.startsWith("/") ? path : `/${path}`;
}

export function localePath(locale: Locale, path: string): string {
  return `/${locale}${normalizePath(path)}`;
}

export function alternateLanguages(path: string): Record<string, string> {
  const result: Record<string, string> = {};

  for (const locale of routing.locales) {
    result[locale] = localePath(locale, path);
  }

  result["x-default"] = localePath(routing.defaultLocale, path);
  return result;
}

export function absoluteUrl(path: string, baseUrl: string): string {
  if (/^https?:\/\//i.test(path)) return path;

  const base = baseUrl.replace(/\/+$/, "");
  return `${base}${normalizePath(path)}`;
}

export function buildMetadata({
  locale,
  path,
  title,
  description,
  type = "website",
  indexable = true,
  images,
}: BuildMetadataOptions): Metadata {
  const canonical = localePath(locale, path);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: alternateLanguages(path),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      locale,
      type,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(images ? { images } : {}),
    },
    robots: { index: indexable, follow: true },
  };
}
