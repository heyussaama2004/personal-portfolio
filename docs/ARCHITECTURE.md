# Architecture

- `src/app/[locale]` — server-rendered pages, metadata, sitemap, OG images.
- `src/components/{ui,landing,os,apps}` — presentational components; interactive leaves are client components.
- `src/config/site.ts` — Zod-validated single source of truth for personal data and links.
- `src/content` — typed content modules and schemas for projects, services, skills, experience and proof.
- `src/i18n` — next-intl routing, request config and message catalogs.
- `src/lib/content` — normalized, localized loaders used by pages and future features.
- `src/lib/os` — pure window-manager reducer, terminal parser and shared command registry.
- `src/lib/contact` — abstract delivery provider with a disabled fallback.

## Future assistant extension

The assistant boundary is `src/lib/assistant/` (types and empty provider interface). An Assistant app slot is reserved behind a feature flag defaulting to `false` and is not rendered. The command registry accepts new actions without UI changes. No chatbot, API keys or network calls exist in V1.
