# Premium Developer Portfolio with Developer OS — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a production-quality, fully functional personal portfolio for Ussama with a clean server-rendered landing page and an interactive Developer OS workspace, in EN/FR/AR with correct RTL.

**Architecture:** Next.js App Router with strict TypeScript and Tailwind CSS tokens. Content and personal data live in Zod-validated typed modules under `src/content` and one `src/config/site.ts`. The OS is a lazy-loaded route at `/[locale]/os` with a pure window-manager reducer and pure terminal parser; the command registry is shared with the palette. Contact uses an abstract provider that stays disabled until env vars exist.

**Tech Stack:** Next.js 16, React 19, TypeScript strict, Tailwind CSS 4, Framer Motion (`LazyMotion`/`domAnimation`), Lucide React, next-intl, Zod, Vitest, Playwright, ESLint, Prettier, GitHub Actions, Vercel.

**Spec:** `docs/SPEC.md`

## Global Constraints

- Never invent content, testimonials, certifications, metrics, social URLs, emails, phone numbers or integrations.
- WhatsApp link only when a number is configured **and** `approved: true`.
- No paid services, no database, no AI chatbot in V1, no placeholder text in production.
- Unconfigured socials, email, WhatsApp, CV files and proof entries are hidden everywhere, including terminal, palette and JSON-LD.
- Dark is the default theme; light theme and reduced motion are fully supported.
- Locales `en`, `fr`, `ar` with locale-prefixed routes, full RTL for Arabic, logical CSS properties.
- Lighthouse ≥ 95 target on landing (mobile) where realistically achievable; accessibility never traded for score.
- One commit per phase on `feat/portfolio`, author `Portfolio Builder <builder@localhost>`.

## Review Focus

- Missing optional config (socials, email, WhatsApp, CV, proof) must hide elements rather than render placeholders or broken links.
- Arabic RTL must mirror OS chrome, dock, terminal, palette and mixed-direction text without breaking layout.
- Boot overlay must never block content, replay during navigation, or ignore reduced motion.
- Contact form must never pretend to send when delivery is unconfigured.
- Adding one project file must produce a working page, filter entry, OS window, terminal command target and metadata without extra edits.

---

## Task 1: Foundation

**Files:** `package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `eslint.config.mjs`, `.prettierrc`, `vitest.config.ts`, `playwright.config.ts`, `src/app/globals.css`, `src/app/[locale]/layout.tsx`, `src/i18n/**`, `src/config/site.ts`, `src/content/schemas.ts`, `docs/**`, `.github/workflows/ci.yml`, `.env.example`.

- [x] Scaffold Next.js App Router + TypeScript + Tailwind, install required dependencies only.
- [x] Add strict TS config, ESLint (Next + jsx-a11y + import), Prettier, Vitest, Playwright, CI skeleton.
- [x] Define CSS-variable design tokens for dark/light, glass and non-blur fallbacks, focus rings, reduced motion.
- [x] Wire next-intl routing with `/[locale]`, `<html lang/dir>`, locale switcher foundation and message files.
- [x] Implement Zod site config and content schemas with optional fields; build fails loudly on invalid config, never on missing optional values.
- [x] Unit-test config visibility helpers (social/CV/WhatsApp/proof) and schema optionality.
- [x] Write docs skeleton and `.env.example`.
- [x] Gate: lint, typecheck, unit tests, build. Commit `feat: foundation`.

## Task 2: Landing page

**Files:** `src/app/[locale]/page.tsx`, `src/components/landing/**`, `src/lib/content/**`, metadata helpers.

- [x] Implement sections in order: hero, services, featured projects, skills, experience/education, proof, digital presence, contact CTA, footer.
- [x] Use typed loaders; hide proof until real entries exist; hide unconfigured CV/social/email/WhatsApp everywhere.
- [x] Sticky navigation, responsive layout, theme and language switchers, skip link.
- [x] Basic per-locale metadata and conditional "Enter Developer OS" CTA.
- [x] Unit-test loaders and conditional visibility; e2e smoke for landing.
- [x] Gate: lint, typecheck, unit, e2e smoke, build. Commit `feat: landing page`.

## Task 3: Projects system

**Files:** `src/content/projects/**`, `src/app/[locale]/projects/[slug]/page.tsx`, `src/components/projects/**`, `src/lib/content/projects.ts`.

- [x] One project per typed file with the full content model; add HRNexus using confirmed facts only.
- [x] Filters by category/tag and shared search, generated cover fallback, missing asset handling.
- [x] Indexable project pages with metadata and OS-app entry points.
- [x] Unit-test loader ordering, filtering, missing-asset fallbacks and one-file addition.
- [x] Gate and commit `feat: projects system`.

## Task 4: Developer OS core

**Files:** `src/app/[locale]/os/**`, `src/components/os/**`, `src/components/apps/**`, `src/lib/os/window-manager/**`.

- [x] Lazy-loaded OS route, skippable once-per-session boot, reduced-motion auto-skip, non-blocking.
- [x] Desktop shell (menu bar, wallpaper, dock), pure window reducer, focus/z-order, minimize/maximize/restore/close.
- [x] Mobile launcher with full-screen apps, visible back button and browser-back support.
- [x] Apps: Projects, Skills, About, Terminal shell slot, Digital Presence, Contact, optional Settings.
- [x] SSR-safe localStorage with try/catch for theme, locale, boot flag and window state.
- [x] Unit-test reducer; e2e for boot/skip and window lifecycle.
- [x] Gate and commit `feat: developer OS core`.

## Task 5: Terminal and command palette

**Files:** `src/lib/os/terminal/**`, `src/lib/os/commands/**`, `src/components/os/terminal/**`, `src/components/os/command-palette/**`, `tests/unit/**`.

- [x] Pure parser with `help`, `about`, `projects`, `skills`, `experience`, `contact`, `cv`, `theme`, `lang`, `open`, `clear`; history, tab completion, suggestions, localized output, Easter eggs.
- [x] Real input, `aria-live` output, keyboard first, mobile usable.
- [x] Cmd/Ctrl+K palette with combobox/listbox semantics, grouped/fuzzy results, focus return, shared registry.
- [x] Unit-test every command, args, errors, suggestions and localization; e2e for both UIs.
- [x] Gate and commit `feat: terminal and command palette`.

## Task 6: Contact and quote system

**Files:** `src/lib/contact/**`, `src/app/[locale]/quote/route.ts` or server action, `src/components/contact/**`, `.env.example`.

- [x] Zod-shared form validation, accessible errors, all states including unconfigured.
- [x] Provider interface with `disabled` fallback and Resend via `fetch` when env vars exist.
- [x] Honeypot, minimum submit time, best-effort in-memory rate limit, sanitization, no data storage.
- [x] Unit-test validation and provider fallback; e2e success/error/unconfigured.
- [x] Gate and commit `feat: contact system`.

## Task 7: SEO, privacy, security

**Files:** `src/lib/seo/**`, `src/app/[locale]/sitemap.ts`, `robots.ts`, `opengraph-image.tsx`, `src/app/[locale]/privacy/**`, `next.config.ts`, `middleware.ts`.

- [x] Per-locale metadata, canonical, hreflang with `x-default`, OG/Twitter and dynamic OG images, JSON-LD Person/WebSite/BreadcrumbList from config only.
- [x] Sitemap/robots, semantic headings, alt text.
- [x] Security headers with nonce-based CSP, privacy page describing real behavior, analytics disabled by default.
- [x] Gate and commit `feat: seo privacy security`.

## Task 8: Hardening

**Files:** `docs/**`, `tests/e2e/**`, CI workflow, performance budget config.

- [x] Axe scans per locale/theme, full keyboard check, RTL checks, cross-browser and mobile runs.
- [x] Lighthouse budgets, bundle report, performance fixes that preserve accessibility.
- [x] Complete README, CONTENT-GUIDE, ARCHITECTURE, DECISIONS, TRANSLATION-REVIEW, EASTER-EGGS, DEPLOYMENT.
- [x] Final report with evidence, limitations and the exact content items the owner must provide.
- [x] Gate: lint, typecheck, test, build, e2e. Commit `chore: hardening and documentation`.
