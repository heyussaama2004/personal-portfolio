# Content Guide

All personal data and external links live in `src/config/site.ts`. Content lives in `src/content/`. Missing optional values hide UI; invalid config fails with Zod errors.

## Config (`src/config/site.ts`)

- `owner`: name, monogram, localized headline/bio, location, availability flags.
- `socials`: `github`, `linkedin`, `instagram`, `youtube`, `x`, `other[]` (`{label,url,icon?}`). `undefined` hides.
- `contact.email`: `undefined` hides.
- `contact.whatsapp`: requires `number` and `approved: true`; number without approval never linked.
- `contact.contactFormEnabled`: derived from `RESEND_API_KEY` + `CONTACT_TO_EMAIL`.
- `cv`: locale-keyed paths to `public/cv/*`; missing files hide download.
- `branding`: optional logo/photo/accent colors.
- `analytics`: disabled by default.
- `site`: `NEXT_PUBLIC_SITE_URL`, default locale, optional OG image.

## Projects

Add `src/content/projects/<slug>.json` matching `projectSchema` (`src/content/schemas.ts`). Required: slug/title/summary/category. Optional: status, featured, order, tags, tech, repoUrl, liveUrl, cover, coverAlt, gallery, galleryAlt, date, role, highlights, body.

Images belong under `public/projects/<slug>/`. Missing cover/gallery fall back safely; generated covers have accessible labels.

## Proof

`src/content/proof/` must contain only real, approved entries. Empty collections hide the proof section. Never add sample testimonials/certifications/metrics.

## Translations

UI strings: `src/i18n/messages/{en,fr,ar}.json`. Keep keys aligned across locales. Arabic is RTL; use logical CSS properties.

## Privacy/Contact Accuracy

Quote form only submits when contact env vars are configured. Submissions are sanitized, rate-limited best-effort, and sent through the configured provider; no database storage. Privacy copy must match real behavior.
