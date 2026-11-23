---
name: code-review
description: Use when reviewing portfolio changes or preparing a change for review — covers stack idioms, Developer OS consistency, theming, i18n and Arabic RTL, accessibility, motion, performance, SEO, typing, and blocking versus non-blocking findings.
---

# Code Review

Review the change in the context of the whole Developer OS. A patch can be syntactically correct and still break the shell, the Arabic layout, or the contact journey.

## Scope

Own the review rubric, severity, and output format. Deep guidance lives in the specialized skills: `nextjs-development`, `frontend-design`, `ui-ux`, `motion-design`, `seo`, `accessibility`, and `performance`.

## Design principles

- **Intent before style.** Confirm the change does what it claims and fits the OS model before commenting on naming or formatting.
- **Severity is meaningful.** Use `blocker` for correctness, security, broken routes, or inaccessible core flows; `should-fix` for regressions in quality or consistency; `nit` for preference. Nits are never blockers.
- **Evidence over opinion.** Point at the file and line, describe the observable consequence, and propose a concrete fix or ask a focused question.
- **Review the diff's blast radius.** A change to a token, layout, or window registry can affect every surface and both locales.
- **Do not edit during a review unless asked.** Leave findings for the author; verify fixes after they land.

## Workflow

1. Read the change and the surrounding files it touches, including the relevant layout and content source.
2. Run the project's existing lint, typecheck, and build scripts from `package.json`; never invent script names.
3. Exercise the changed flow in the browser: keyboard only, dark and light themes, 320px width, and Arabic RTL.
4. Check bundle or hydration impact when the change adds client components or animation.
5. Write findings with severity and a suggested fix, then list what was and was not verified.
6. Re-check only the blocking items after they are addressed.

## Coding standards applied

- **Types and framework:** strict TypeScript, no `any`, no mixed router conventions, correct server/client boundaries, metadata present where a route needs it.
- **UI system:** existing tokens instead of literal colors, Lucide icon scale consistent, one elevation language, responsive behavior down to 320px, logical properties for RTL.
- **Interaction and a11y:** focus moves and returns correctly, dialogs have names, icon-only controls are labelled, reduced motion is respected, contrast holds in both themes.
- **Motion and performance:** exits are animated or intentionally instant, no layout-thrashing properties, no unnecessary client bundle growth, images and fonts loaded through Next.js APIs.
- **SEO and content:** localized metadata and canonical/hreflang intact, visible crawlable links, truthful structured data, no invented credentials.
- **Security and ops:** no secrets in client code, external links use safe `rel` attributes, environment values accessed through the correct tier.

## Finding format

```
[blocker] path/to/file.tsx:42 — Closing the project window leaves focus on <body>.
Fix: restore focus to the launcher that opened it, as the other windows do.

[should-fix] path/to/file.tsx:18 — Arabic layout uses ml-6, so spacing flips
incorrectly in RTL. Use ms-6.

[nit] path/to/file.tsx:9 — Consider grouping these window variants with the component.
```

## Constraints

- No "looks good" without stating which checks were actually run.
- No blocking comments based purely on personal taste, and no demands for unrelated refactors.
- No new dependency suggested as the only acceptable fix.
- No approval while a broken locale, theme, keyboard path, or build remains.

## Quality checks

- [ ] Every finding has a severity, a location, and an actionable next step.
- [ ] Blocking items were re-verified after the author fixed them.
- [ ] Lint, typecheck, and build results are stated explicitly.
- [ ] Keyboard, theme, viewport, and RTL checks are reported as done or skipped.
- [ ] The summary distinguishes verified behavior from assumptions.
