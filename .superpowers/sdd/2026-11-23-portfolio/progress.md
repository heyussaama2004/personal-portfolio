# SDD ledger — plan: docs/superpowers/plans/2026-11-23-portfolio.md

Setup: branch `feat/portfolio` from root commit `4498f70`; baseline is an empty project with only project skills.
Pre-flight: no shared interfaces exist yet; the plan defines them in each phase.
Ruling: no linked worktree — repository was empty with no branch to protect; in-place feature-branch isolation is sufficient — cost: no second checkout, recoverable via git history.
Ruling: git author `Portfolio Builder <builder@localhost>` supplied by owner — cost: commits are neutral rather than personally attributed.
Ruling: npm package manager — standard Vercel/CI compatibility — cost: slightly slower than pnpm.
Ruling: typed TS content instead of MDX in V1 — one validated loader path, no extra MDX toolchain — cost: long-form project bodies use structured highlights until MDX is added.
Ruling: OS is a real `/[locale]/os` route — shareable and crawlable — cost: one client boundary at the route.
Ruling: dark default with stored user choice, no system-preference override — avoids spec contradiction and FOUC — cost: light-mode system users see dark until they toggle.
Ruling: Resend provider uses `fetch` behind env vars — no paid-tier dependency — cost: no SDK ergonomics.
Task 1: complete (base 4498f70, tests: npm test → 17 passed; lint, typecheck, build green; route `/[locale]` currently dynamic — revisit in phase 7).
Ruling: project content lives in `src/content/projects/*.json` and is parsed with Zod by an fs-backed server loader — adding one JSON file adds one project — cost: client surfaces must receive serialized project props.
Ruling: theme toggle uses `useSyncExternalStore` over the existing inline theme script — no hydration mismatch or setState-in-effect — cost: one module-level listener set.
Ruling: presence icons use generic Lucide glyphs — brand icons are not exported by installed lucide-react v1 — cost: social names remain as text labels.
Task 2: complete (landing page composed; npm test → 27 passed; lint, typecheck, build green; featured projects/proof/presence correctly hidden while unconfigured; Chromium e2e smoke added and passing).
Ruling: e2e smoke uses Playwright with a dev-server webServer; CI installs all browsers via `npx playwright install --with-deps` before `npm run e2e`.
Task 3: complete (HRNexus content file, project listing/detail routes, filters/search, generated covers and missing-asset fallbacks; npm test → 33 passed; lint, typecheck, build green; Chromium e2e smoke → 3 passed).
Ruling: OS shell is client-only via `next/dynamic({ssr:false})` in a client loader — avoids hydration cost for the interactive desktop — cost: one extra client boundary at `/os`.
Ruling: boot flag uses sessionStorage, window state uses localStorage, all access wrapped in try/catch — matches once-per-session and restore expectations without throwing in restricted browsers.
Ruling: terminal app in Phase 4 is an honest "next build" message rather than a fake prompt — real parser lands in Phase 5 — cost: one empty app slot until then.
Task 4: complete (boot/skip, pure window reducer, desktop dock/windows, mobile launcher with browser-back, SSR-safe storage, 7 app slots; npm test → 40 passed; lint, typecheck, build green; Chromium e2e → 5 passed).
Ruling: terminal parsing is pure and injected with data/t; side effects stay in DeveloperOS through typed TerminalAction values — keeps parser unit-testable and UI-independent — cost: one action switch to maintain.
Ruling: command registry and palette builder are shared; palette groups items in a pure helper so visual and keyboard order match — avoids aria-activedescendant jumps — cost: an extra ordering helper.
Ruling: palette action items only expose configured email, WhatsApp, CV and social links — unconfigured channels stay hidden — cost: item list changes with config.
Ruling: terminal run actions queue commands with a monotonic nonce and are executed by an already-mounted terminal via deferred timer — supports CV palette action without fake navigation — cost: one deferred update per queued command.
Task 5: complete (parser, commands, palette, terminal UI, project targeting, trilingual messages; npm test → 56 passed; lint, typecheck, build green; Chromium e2e → 10 passed; code review findings fixed).
Ruling: quote POST endpoint lives at `/api/quote` because Next forbids a page and route at the same `/[locale]/quote` path — keeps the localized page shareable and the API locale-independent — cost: one non-localized endpoint.
Ruling: contact form enabled state derives from `RESEND_API_KEY` + `CONTACT_TO_EMAIL`, with optional `CONTACT_FROM_EMAIL` for verified Resend sender — matches two-variable activation while allowing sender override — cost: local unconfigured state must be exercised without env vars.
Ruling: unconfigured quote page renders only status copy, never an active form — prevents a form that always returns 503 — cost: enabled-state e2e runs in a second Playwright pass with test-only env vars.
Ruling: client and server share `quoteSchema`; client submits `safeParse` output and native validation is disabled via `noValidate` — localized errors stay in-page and server validation remains authoritative — cost: zod is included in the form client bundle.
Ruling: `projectTypeSchema` is shared between service content and quote validation — adding a service cannot silently desync the API enum — cost: contact schema imports a content schema.
Task 6: complete (base c21d4f9; Zod form and provider abstractions, Resend fetch provider, honeypot/timing/rate limit/sanitization, /quote page and /api/quote endpoint, trilingual keys, links from landing/OS, code review findings fixed; npm test → 66 passed; lint, typecheck, build green; Chromium e2e unconfigured pass → 11 passed, enabled quote pass → 3 passed; impeccable detector clean).
Ruling: nonce-based CSP is enforced in src/proxy.ts with x-nonce forwarded to request headers and security headers mirrored on the response; locale layout is orce-dynamic and reads nonce for theme/JSON-LD scripts ??" satisfies strict CSP without unsafe-inline scripts ??" cost: locale routes are rendered dynamically.
Ruling: sitemap and robots use root App Router file conventions (src/app/sitemap.ts, src/app/robots.ts) with locale alternates including x-default; /os and /quote are excluded from sitemap and quote/OS remain 
oindex, follow ??" keeps crawl surface aligned with real public pages ??" cost: metadata is centralized in src/lib/seo.
Ruling: JSON-LD Person/WebSite/BreadcrumbList is generated from siteConfig and configured visibility helpers only; unconfigured email/social/photo are omitted ??" no invented identity data ??" cost: structured data is minimal until owner configures fields.
Ruling: Open Graph images use dynamic 
ext/og routes per locale and per project, and project/detail/gallery images require descriptive alt text from content or localized fallbacks ??" keeps social previews and accessibility honest ??" cost: OG routes add dynamic image endpoints.
Task 7: complete (base 23c613e; SEO helpers, JSON-LD, sitemap/robots, dynamic OG images, per-locale metadata/canonical/hreflang+x-default, privacy page, nonce CSP/security headers in proxy, semantic alt text; npm test ??' 73 passed; lint, typecheck, build green; Chromium e2e ??' 16 passed, 3 skipped; seo e2e ??' 5 passed).
