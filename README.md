# Ussama Portfolio

Production trilingual portfolio (EN/FR/AR) with a server-rendered landing page and an interactive Developer OS. Built for Vercel free tier with no database, no paid services, and config-first content.

## Stack

- Next.js 16 (App Router) + TypeScript strict
- Tailwind CSS 4 + Framer Motion + Lucide
- next-intl (locale-prefixed routes, RTL Arabic)
- Zod config/content validation
- Vitest + Testing Library + Playwright (+ axe-core)

## Commands

```bash
npm run dev            # local dev server
npm run lint           # ESLint
npm run typecheck      # tsc --noEmit
npm test               # Vitest unit tests
npm run build          # production build
npm run perf:budget    # bundle budget check (run after build)
npm run e2e            # Playwright e2e (all configured projects)
npm run format:check   # Prettier check
```

## Content & Config

- **Config truth**: `src/config/site.ts` (Zod-validated). Missing optional values hide UI, never fail build.
- **Content**: `src/content/` typed modules/schemas; projects in `src/content/projects/*.json`.
- **Translations**: `src/i18n/messages/{en,fr,ar}.json`.
- **No invented content**: socials, email, WhatsApp, CV, proof, metrics, testimonials stay hidden until configured.

## Routes

| Route                       | Purpose        | Indexable                                   |
| --------------------------- | -------------- | ------------------------------------------- |
| `/[locale]`                 | Landing page   | yes                                         |
| `/[locale]/projects`        | Projects index | yes                                         |
| `/[locale]/projects/[slug]` | Project detail | yes                                         |
| `/[locale]/privacy`         | Privacy policy | yes                                         |
| `/[locale]/os`              | Developer OS   | noindex, follow                             |
| `/[locale]/quote`           | Quote request  | noindex, follow (form only when configured) |

## Documentation

- `docs/CONTENT-GUIDE.md` - edit owner/content safely
- `docs/ARCHITECTURE.md` - structure and boundaries
- `docs/DECISIONS.md` - key technical/product decisions
- `docs/TRANSLATION-REVIEW.md` - human translation review notes
- `docs/EASTER-EGGS.md` - harmless terminal easter eggs
- `docs/DEPLOYMENT.md` - Vercel deployment
- `docs/FINAL-REPORT.md` - hardening evidence, limitations, owner TODOs
