# Architecture

## High-Level

- `src/app/[locale]` - server-rendered locale routes, metadata, OG images, privacy, OS, projects, quote.
- `src/app/sitemap.ts`, `src/app/robots.ts` - crawl/index control.
- `src/proxy.ts` - next-intl locale routing + nonce-based CSP/security headers.
- `src/components/{ui,landing,projects,contact,os,apps,seo}` - UI; interactive leaves are client components.
- `src/config/site.ts` - Zod-validated single source of truth for owner, links, contact, CV, branding, analytics.
- `src/content` - typed schemas/content and project JSON.
- `src/i18n` - routing/request config and message catalogs.
- `src/lib/content` - localized loaders and project filtering.
- `src/lib/os` - pure window reducer, command registry, terminal parser, storage adapters.
- `src/lib/contact` - Zod schemas, validation, sanitization, rate limit, provider abstraction; Resend via fetch when env-configured.
- `src/lib/seo` - metadata alternates, JSON-LD builders, sitemap entries, CSP/security headers.

## Boundaries

- **Server-first landing**: landing/project pages render as server components; client JS limited to interactive islands.
- **Config truth**: components read config/content through loaders/helpers; missing optional data hides UI.
- **No fake data**: proof/testimonials/social/contact/CV are conditional on real configured entries.
- **Privacy**: no DB; quote submissions are sanitized and sent to configured provider only; analytics disabled by default.
- **OS isolation**: Developer OS is a real route, loaded client-side behind its boundary.

## Future Extension

Assistant boundary is reserved (`docs/ARCHITECTURE.md` intent) behind feature flag/default off. Command registry can accept actions without UI redesign. No AI/chat/network calls in V1.
