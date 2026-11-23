# Final Report — Portfolio Hardening (Task 8)

## Summary

Phase 8 hardening completed on `feat/portfolio` at base `8750c7d90284dc068a56969d20e3838cedceb39f` (before this commit). Added accessibility/RTL/keyboard/mobile hardening tests, fixed axe/skip-link/mobile-test issues, added bundle budget check, and completed required documentation.

## Verification Evidence

| Check                                                        | Result                                                                            |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| `npm run lint`                                               | pass                                                                              |
| `npm run typecheck`                                          | pass                                                                              |
| `npm test -- --reporter=dot`                                 | pass, 12 files / 73 tests                                                         |
| `npm run build`                                              | pass (Next 16.4.6 Turbopack)                                                      |
| `npm run perf:budget`                                        | pass, `chunks=15 totalJsBytes=875604 rootMain+polyfill=556891` (budget 600000)    |
| Playwright chromium all e2e                                  | pass, 30 passed / 3 skipped                                                       |
| Playwright firefox/webkit/mobile smoke+seo+os+terminal+quote | pass, 45 passed / 9 skipped; after mobile test fixes: mobile os+terminal 7 passed |
| Hardening axe/keyboard/RTL (chromium)                        | pass, 14 passed (`tests/e2e/hardening.spec.ts`)                                   |
| Lighthouse (local prod, Chromium headless) `/en`             | Perf 99, A11y 96, BP 96, SEO 92                                                   |
| Lighthouse (local prod) `/en/privacy`                        | Perf 98, A11y 96, BP 96, SEO 92                                                   |

## Fixes Applied During Hardening

- Fixed heading order: project cards use `h2` in listing context (`src/components/projects/project-card.tsx`).
- Added `h1` to `/[locale]/os` and `tabIndex={-1}` to all route `main` elements for reliable skip-link focus.
- Adjusted OS/terminal e2e selectors for mobile launcher vs dock.
- Added bundle budget script: `scripts/check-bundle-budget.mjs`, `performance-budget.json`, `npm run perf:budget`.

## Limitations

- **CSP/security tradeoff**: nonce CSP is enforced via `src/proxy.ts`; locale layout is `force-dynamic` to attach nonces. This prioritizes security over full static prerendering of locale HTML.
- **Lighthouse SEO 92**: local/production crawlability signals can vary by environment; verify deployed URL has correct `NEXT_PUBLIC_SITE_URL`, robots/sitemap reachable, and no unintended noindex.
- **Lighthouse Best Practices 96**: recheck on deployed HTTPS domain; local headless/prod flags can differ.
- **Cross-browser runs**: Firefox/WebKit/mobile projects pass for key suites; full CI installs all browsers with deps.
- **No visual regression suite**: no Percy/Chromatic; rely on Playwright functional/e2e + manual review.
- **Contact form live delivery not e2e-verified with real Resend**: enabled-state tests use env-gated test mode/mocked API path as before; real provider needs credentials.

## Exact Owner-Provided Content / Config Needed

- **Social URLs**: `siteConfig.socials.github/linkedin/instagram/youtube/x/other` in `src/config/site.ts`.
- **Email**: `siteConfig.contact.email`.
- **WhatsApp**: `siteConfig.contact.whatsapp.number` and set `approved: true` only with explicit approval.
- **CV PDFs**: add files under `public/cv/` and set `siteConfig.cv.en/fr/ar`.
- **Branding**: `branding.logo`, `branding.photo`, confirm accent colors.
- **OG image (optional)**: `siteConfig.site.ogImage` or rely on generated OG routes.
- **Project assets**: real cover/gallery images and alt text in project JSON.
- **Proof entries**: only real testimonials/certifications/metrics in `src/content/proof/*`; keep empty if none.
- **Deployment env**: `NEXT_PUBLIC_SITE_URL`, and if contact form desired: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, optional `CONTACT_FROM_EMAIL`.
- **Analytics (optional, disabled by default)**: set provider/id only with privacy-compliant choice.
- **Translation human review**: complete `docs/TRANSLATION-REVIEW.md` checklist.

## Residual Risks / Follow-up

- Run full `npx playwright test` in CI/Linux with all browsers installed.
- Run Lighthouse on deployed production URL and archive reports.
- Consider adding visual regression snapshots for EN/FR/AR dark/light and OS states.
- Consider reducing root client JS by auditing largest chunks after dependency upgrades (Next/Turbopack/build-manifest driven).
