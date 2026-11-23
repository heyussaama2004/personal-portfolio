# Portfolio Specification (condensed from owner brief)

## Hard rules

- Production-quality, every button/link/state works; no visual prototype.
- Never invent content: no fake clients, testimonials, certifications, metrics, social URLs, emails, phone numbers or integrations.
- WhatsApp link only with configured number **and** `approved: true`.
- Free/open-source tools only; no database; no AI chatbot in V1; no lorem ipsum or placeholders in production.
- If content is missing, render a graceful state or hide the element.
- Content lives in typed TS/JSON (MDX optional); one central config plus content files.

## Identity

Owner Ussama, monogram OL, Laâyoune, Morocco. Availability: open to jobs, freelance projects, remote opportunities. Final name, logo, photo are placeholders replaced via config.

Audience priority: clients (quote request), recruiters (view/download CV), developers (GitHub projects). Morocco + international remote.

## Landing sections (order)

Hero, Services, Featured projects, Skills, Experience/education, Proof, Digital presence, Contact/quote, Footer. Sticky nav: Projects, Services, CV, Contact. Core content server-rendered without JS.

Services: website development, business websites and landing pages, web applications, backend, AI automation/workflow integration, API integrations.

Proof section hidden by default; activates only when real entries exist in `content/proof/*`. Schemas: testimonial (name, role, company, quote, optional link/consent), certification (title, issuer, date, credential URL), metric (label, value, source/context). Never ship samples.

Experience: Technicien Spécialisé en Développement Digital (Bac+2), Institut Al-Ahramate, Laâyoune; Internship at Provincial Directorate of National Education, Laâyoune; personal development projects. Dates optional; hide when absent.

## Projects

Model: `slug, title, summary, category, status, featured, order, tags/tech[], repoUrl?, liveUrl?, cover?, gallery?[], date?, role?, highlights?[], body?`. Adding one file adds a project. Categories: PHP/MySQL, Web development, Frontend experiments, AI automation, Personal/experimental. Flagship HRNexus (HR/payroll for Moroccan businesses, PHP/MySQL) — confirmed facts only, high-level and editable. Hide missing demo/repo buttons; generated gradient+icon+title cover when no screenshot. Filter by category/tag, shared search. Indexable `/[locale]/projects/[slug]` and OS window.

## Central config

`src/config/site.ts`, Zod-validated at build: name, monogram, localized headline/bio, location, availability flags, socials (all undefined initially), contact (`email?`, `whatsapp {number?, approved:boolean}`, `contactFormEnabled`), cv `{en?,fr?,ar?}`, branding (monogram default, optional photo, accent colors), analytics, site URL/default locale/OG defaults. Invalid config fails loudly; missing optional values never fail. Document every field in `docs/CONTENT-GUIDE.md`. No fake email shown; form states honest.

## Developer OS

Landing first; CTA opens `/[locale]/os` (real shareable route). Boot ~2s minimal monogram/progress/status, skip always visible and on any key/click, once per session via sessionStorage, auto-skip on reduced motion, never blocks content or hydration.

Desktop ≥ tablet landscape: wallpaper (gradient/grid), menu bar (name, clock, theme, language, palette), persistent dock, simplified windows (open/close/minimize/maximize/focus/z-order, active/inactive states, dock restore). Drag/resize optional; omit unless robust and keyboard-operable. Keyboard accessible, logical roles/names, Esc shortcuts, SSR-safe localStorage try/catch.

Apps: Projects, Skills (Core/Working/Learning — no fake percentages), About, Terminal, Digital Presence, Contact, optional Settings.

Mobile < tablet: iOS-style launcher, status header, dock, full-screen apps with visible back and browser back, 44px targets.

Terminal: real input, aria-live output, keyboard/mobile. Commands `help, about, projects, skills, experience, contact, cv, theme, lang, open [app], clear`; `projects <slug>`, `theme [dark|light|toggle]`, `lang [en|fr|ar]`. History ↑/↓, tab completion, typo suggestions, error handling, localized output. Harmless undocumented Easter eggs documented in `docs/EASTER-EGGS.md`. Parser pure and unit-tested, separate from UI.

Palette: Ctrl/Cmd+K, Esc, visible button, combobox/listbox with `aria-activedescendant`, focus return, fuzzy grouped results, actions for navigation/apps/projects/theme/lang/contact/CV/socials. Registry shared with terminal.

## Visual identity

Dark premium futuristic original design. Tokens: near-black #0B0D12/#11141B, surface #161A23, blue #3B82F6→#60A5FA, violet #8B5CF6, AA text. Light theme equivalent. Refined glassmorphism with non-blur fallback. `next/font` self-hosted UI + mono fonts; Arabic font with proper weights. Short meaningful motion, reduced-motion aware. Temporary OL monogram + generated favicon/OG; assets replaceable via config/public.

## i18n

EN primary, FR, AR; `/en`, `/fr`, `/ar`; full RTL via `dir="rtl"`, logical properties, mirrored icons/layout, LTR snippets. Everything translated including terminal, palette, boot, metadata, errors; graceful visible fallback to English with dev log. Switcher on every page preserves route/context. Natural FR/MSA; flag review items in `docs/TRANSLATION-REVIEW.md`.

## Contact

Quote form: name, email, project type from services, optional budget/timeline, message, consent. Zod shared client/server, accessible errors, loading/success/error/unconfigured states. Abstract email provider; `disabled` default; Resend activated only with `RESEND_API_KEY` + `CONTACT_TO_EMAIL`. Honeypot, min submit time, best-effort edge-compatible rate limit, sanitization, no stored submissions. mailto only if email configured. `.env.example` documents all vars.

## Future assistant boundary

Typed content loaders; `assistant` module with types + empty provider interface; reserved non-rendered Assistant app slot behind flag default false; command registry extensible. No UI/API calls in V1. Document in `docs/ARCHITECTURE.md`.

## SEO

Per-page/locale titles and descriptions, canonical, hreflang en/fr/ar + x-default, OG/Twitter, dynamic `next/og` images including per-project, JSON-LD Person/WebSite/BreadcrumbList from configured data only, sitemap with alternates, robots, semantics, alt text, clean URLs. Key content indexable server-rendered.

## Privacy/security

No unnecessary cookies/tracking, no cookie banner unless required. Optional analytics disabled by default. Privacy page accurate. Security headers CSP/X-Content-Type-Options/Referrer-Policy/Permissions-Policy/frame protections with Next-compatible CSP. Validate inputs, sanitize MDX sources, `rel="noopener noreferrer"`, no client secrets, dependency audit in CI.

## Quality

Lighthouse ≥95 target (never sacrifice a11y/functionality). Mid-range mobile, slow networks, lazy OS, next/image AVIF/WebP, next/font subsets Latin+Arabic, no CLS, CWV focus, SSG, cache headers. WCAG 2.2 AA keyboard, focus, landmarks, skip link, ARIA, axe, 24px/44px targets, 200% zoom, reduced motion. Strict TS, ESLint+Prettier, Vitest units, Playwright e2e (3 browsers, mobile), GitHub Actions CI.

## Delivery

8 phases with lint/typecheck/test/build gates and one commit each: Foundation, Landing, Projects, OS core, Terminal+palette, Contact, SEO/privacy/security, Hardening. Final report lists built work, evidence, limitations and exact owner-provided items still missing.
