---
name: seo
description: Use when working on metadata, discoverability, sitemaps, structured data, or shared links for the portfolio — covers Next.js Metadata API, Open Graph images, hreflang for Arabic and English, robots and sitemap files, and crawlable content.
---

# SEO

A recruiter should find the portfolio from a search result and understand who it belongs to before opening a single window. Metadata is server-rendered document data, not a client-side effect.

## Scope

Own document metadata, structured data, sitemap and robots output, and crawlability. Rendering structure belongs to `nextjs-development`; speed factors belong to `performance`.

## Design principles

- **One source of truth per page.** Root layout supplies defaults through `metadata`; each route overrides only what differs. Use `generateMetadata` for project detail pages and `metadataBase` for absolute URLs.
- **Every locale is a first-class URL.** For English and Arabic, set `alternates.canonical` plus `alternates.languages`, and pair them with matching `<html lang>` and `<html dir>`. Never serve both locales from one unmarked URL.
- **Share previews are part of the design.** `openGraph` and `twitter` cards need a real image, title, and description. Use `opengraph-image.tsx` with `ImageResponse` from `next/og` — no extra package — and an Arabic-capable font when localizing card text.
- **The important copy is in the HTML.** Headline, project names, and role descriptions must be present in the server-rendered markup and reachable through real `<Link>` elements.
- **Structured data describes a person, not a product.** Prefer `Person` with `worksFor`, `knowsAbout`, `sameAs`, and `alumniOf` where truthful. Do not invent employers, awards, or metrics.

## Workflow

1. State the page's intent and the phrase a visitor would search to find it.
2. Set title, description, canonical URL, and locale alternates for that route.
3. Confirm the primary copy and navigation links render without JavaScript.
4. Add or update JSON-LD only for facts already present on the page.
5. Check the shared-link preview and the page source before merging.
6. Re-run metadata checks whenever a route or locale is added.

## Coding standards

- Keep a single site config for domain, author, and social profiles; import it into layouts and metadata helpers.
- Type metadata objects with `satisfies Metadata` so shape errors surface at build time.
- Serialize JSON-LD safely and keep it adjacent to the page it describes, not in a global client component.
- Descriptive link text and image `alt` text come from the locale catalog, including social card alt text.
- Canonical and hreflang URLs follow the exact same locale path convention as navigation.

## Constraints

- No keyword stuffing, hidden text, cloaking, or doorway pages.
- No client-only critical copy, no project details unlocked by a click, no content injected after hydration.
- No third-party SEO or schema package unless the project already depends on one.
- Do not claim skills, roles, or credentials that are not on the portfolio itself.

## Quality checks

- [ ] View source shows the correct title, description, canonical, and hreflang for each locale.
- [ ] `sitemap.ts` lists the localized URLs and `robots.ts` does not block them.
- [ ] Open Graph and Twitter previews render real images with readable localized text.
- [ ] Exactly one `<h1>` per page and a logical heading order across windows.
- [ ] JSON-LD parses cleanly and every claim is visible on the page.
- [ ] Project links are crawlable anchors and images have meaningful alt text.

See also: `nextjs-development`, `accessibility`, `performance`.
