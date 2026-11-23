# Content Guide

All personal data and external links live in `src/config/site.ts`. Content lives in `src/content/`.

## Config fields

- `owner`: name, monogram, localized headline and bio, location, availability flags.
- `socials`: `github`, `linkedin`, `instagram`, `youtube`, `x`, plus `other[]` with `{label, url, icon?}`. Leave a platform `undefined` to hide it everywhere.
- `contact.email`: leave `undefined` to hide email links.
- `contact.whatsapp`: set `number` and `approved: true` to show a WhatsApp link. A number without approval is never linked.
- `contact.contactFormEnabled`: enables direct submission when a provider is configured.
- `cv`: `en`, `fr`, `ar` paths to PDFs under `public/cv/`. Missing files hide their download buttons.
- `branding`: optional `logo` and `photo` paths, accent colors.
- `analytics`: provider and enabled flag; disabled by default.
- `site`: public URL, default locale, optional OG image.

Invalid config fails the build with a clear Zod error. Missing optional values never fail the build.

## Adding a project

Create one typed file in `src/content/projects/` that satisfies `projectSchema`. It becomes available on the projects index, in filters/search, in the OS app, in the terminal, and as an indexable page. Missing `repoUrl`, `liveUrl`, `cover` and `gallery` are supported; generated covers and hidden buttons handle them.

## Proof section

The section is hidden until at least one real entry exists in `src/content/proof/`. Never add sample testimonials, certifications or metrics.
