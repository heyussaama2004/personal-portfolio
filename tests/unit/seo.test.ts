import { describe, expect, it } from "vitest";
import { siteConfig, type SiteConfig } from "@/config/site";
import {
  absoluteUrl,
  alternateLanguages,
  buildCspHeader,
  buildJsonLd,
  buildMetadata,
  buildSitemapEntries,
} from "@/lib/seo";

describe("seo helpers", () => {
  it("builds locale alternates with x-default for nested paths", () => {
    expect(alternateLanguages("/")).toEqual({
      en: "/en",
      fr: "/fr",
      ar: "/ar",
      "x-default": "/en",
    });
    expect(alternateLanguages("/projects/hrnexus")).toEqual({
      en: "/en/projects/hrnexus",
      fr: "/fr/projects/hrnexus",
      ar: "/ar/projects/hrnexus",
      "x-default": "/en/projects/hrnexus",
    });
  });

  it("builds page metadata with canonical, hreflang, Open Graph and Twitter tags", () => {
    const metadata = buildMetadata({
      locale: "en",
      path: "/projects/hrnexus",
      title: "HRNexus",
      description: "Project summary",
      type: "article",
    });

    expect(metadata.alternates).toEqual({
      canonical: "/en/projects/hrnexus",
      languages: {
        en: "/en/projects/hrnexus",
        fr: "/fr/projects/hrnexus",
        ar: "/ar/projects/hrnexus",
        "x-default": "/en/projects/hrnexus",
      },
    });
    expect(metadata.openGraph).toMatchObject({
      title: "HRNexus",
      description: "Project summary",
      locale: "en",
      type: "article",
      url: "/en/projects/hrnexus",
    });
    expect(metadata.twitter).toEqual({
      card: "summary_large_image",
      title: "HRNexus",
      description: "Project summary",
    });
    expect(metadata.robots).toEqual({ index: true, follow: true });
  });

  it("marks non-indexable pages noindex while keeping follow", () => {
    const metadata = buildMetadata({
      locale: "en",
      path: "/os",
      title: "Developer OS",
      description: "Interactive workspace",
      indexable: false,
    });

    expect(metadata.robots).toEqual({ index: false, follow: true });
  });

  it("builds JSON-LD from configured data only and breadcrumbs", () => {
    const config: SiteConfig = structuredClone(siteConfig);
    config.contact.email = "owner@example.com";
    config.socials.github = "https://github.com/owner";

    const graph = buildJsonLd({
      config,
      locale: "fr",
      path: "/projects/hrnexus",
      breadcrumbs: [
        { name: "Accueil", path: "/" },
        { name: "Projets", path: "/projects" },
        { name: "HRNexus", path: "/projects/hrnexus" },
      ],
    });

    const person = graph.find((item) => item["@type"] === "Person");
    const website = graph.find((item) => item["@type"] === "WebSite");
    const breadcrumbs = graph.find((item) => item["@type"] === "BreadcrumbList");

    expect(person).toMatchObject({
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Ussama",
      email: "owner@example.com",
      sameAs: ["https://github.com/owner"],
    });
    expect(website).toMatchObject({
      "@type": "WebSite",
      name: "Ussama",
      inLanguage: ["en", "fr", "ar"],
    });
    expect(breadcrumbs).toMatchObject({
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Accueil",
          item: absoluteUrl("/fr", config.site.url),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Projets",
          item: absoluteUrl("/fr/projects", config.site.url),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "HRNexus",
          item: absoluteUrl("/fr/projects/hrnexus", config.site.url),
        },
      ],
    });
  });

  it("omits unconfigured contact and social fields from JSON-LD", () => {
    const graph = buildJsonLd({ config: siteConfig, locale: "en", path: "/" });
    const person = graph.find((item) => item["@type"] === "Person");

    expect(person).not.toHaveProperty("email");
    expect(person).not.toHaveProperty("sameAs");
    expect(person).not.toHaveProperty("image");
  });

  it("builds a nonce-based CSP with development-only eval allowance", () => {
    const production = buildCspHeader({ nonce: "abc123", isDev: false });
    const development = buildCspHeader({ nonce: "abc123", isDev: true });

    expect(production).toContain("'nonce-abc123'");
    expect(production).toContain("'strict-dynamic'");
    expect(production).toContain("frame-ancestors 'none'");
    expect(production).toContain("style-src-attr 'unsafe-inline'");
    expect(production).not.toContain("'unsafe-eval'");
    expect(development).toContain("'unsafe-eval'");
  });

  it("builds a sitemap with locale alternates and excludes private surfaces", () => {
    const entries = buildSitemapEntries(siteConfig);
    const paths = entries.map((entry) => new URL(entry.url).pathname);

    expect(paths).toContain("/en");
    expect(paths).toContain("/fr/projects");
    expect(paths).toContain("/ar/projects/hrnexus");
    expect(paths).toContain("/en/privacy");
    expect(paths).not.toContain("/en/os");
    expect(paths).not.toContain("/en/quote");

    const home = entries.find((entry) => new URL(entry.url).pathname === "/en");
    expect(home?.alternates?.languages?.["x-default"]).toBe(`${siteConfig.site.url}/en`);
  });
});
