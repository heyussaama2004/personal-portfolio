# Deployment

Target: Vercel free tier. No database or paid service required.

## Vercel

1. Import the repository.
2. Set env vars:
   - `NEXT_PUBLIC_SITE_URL=https://your-domain` (required for canonical/sitemap/OG absolute URLs)
   - `RESEND_API_KEY=` (optional)
   - `CONTACT_TO_EMAIL=` (optional)
   - `CONTACT_FROM_EMAIL=` (optional, verified sender)
   - `NEXT_PUBLIC_ANALYTICS_PROVIDER=none`
   - `NEXT_PUBLIC_ANALYTICS_ID=`
3. Build command: `npm run build` (default).
4. Add custom domain in Vercel and update `NEXT_PUBLIC_SITE_URL`.

## Contact Form

Quote submission is enabled only when `RESEND_API_KEY` and `CONTACT_TO_EMAIL` are set. Without them, `/[locale]/quote` shows an honest unconfigured state and API returns disabled.

## CI

GitHub Actions workflow: `.github/workflows/ci.yml` runs lint, typecheck, unit tests, build, Playwright install, e2e, and `npm audit --audit-level=high` (non-blocking).

## Post-deploy Checks

- Verify `/en`, `/fr`, `/ar`, `/sitemap.xml`, `/robots.txt`.
- Verify locale alternates/canonical and OG images.
- Verify `/en/os` and `/en/quote` are `noindex,follow`.
- Verify security headers/CSP in response.
