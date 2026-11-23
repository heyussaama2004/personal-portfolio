---
name: nextjs-development
description: Use when creating or refactoring routes, layouts, components, or data flow in the Next.js App Router portfolio — covers server and client boundaries, typed content, metadata, i18n and dir setup, error and loading files, and TypeScript standards.
---

# Next.js Development

The App Router structure is the architecture. Routes own their data and metadata; client components are small islands for the interactive OS shell.

## Scope

Own route structure, rendering boundaries, typed content, and framework conventions. Styling decisions go to `frontend-design`, metadata content to `seo`, and client-boundary cost to `performance`.

## Design principles

- **Server first.** Default to Server Components for project data, prose, and layout. Add `"use client"` only where hooks, event handlers, or Framer Motion require it.
- **Serializable boundaries.** Pass plain typed data from server to client. Never import server-only modules, environment secrets, or Node APIs into a client component.
- **The root layout owns the document.** `<html lang>` and `<html dir>`, theme tokens, font setup, and the OS shell live there. Locale is either a route segment or a persisted preference — pick one deliberately and keep it consistent across links and metadata.
- **Content is data.** Projects, roles, and localized copy live in typed content modules. Components render them; they do not invent them.
- **Every route has a state story.** Loading, error, and not-found UI are part of the route, not an afterthought.

## Workflow

1. Identify the route and its locale scope before creating files.
2. Draw the server/client boundary: list which components need hooks or browser APIs.
3. Define the typed content contract for the route, including localized fields.
4. Implement layout, page, `loading.tsx`, `error.tsx`, and `not-found.tsx` where the route needs them.
5. Run the project's lint, typecheck, and build commands from `package.json` — do not guess script names.
6. Verify both locales, both themes, and a deep link into a nested window.

## Coding standards

- TypeScript stays in strict mode. No `any`, no unchecked JSON casts, no `as` used to silence a real mismatch.
- Model window and locale state with discriminated unions so impossible combinations do not compile.
- Use the path aliases already configured in `tsconfig.json`; avoid deep relative imports.
- Use `next/image` with explicit dimensions for imagery and `next/font` for typography. Include an Arabic-capable font when Arabic copy is rendered.
- Route handlers under `app/api` only for work that truly must run on the server, such as a contact form submission.
- Keep imports from UI libraries specific so bundlers can tree-shake them.

## Constraints

- No `pages/` directory and no mixed router conventions.
- No client-side fetching for static portfolio content; it hurts both speed and crawlability.
- No `useEffect` for state derivable during render, and no global providers that force the whole tree to hydrate.
- No secrets, private keys, or server-only environment variables referenced from client code.
- Do not introduce a data-fetching or state-management package without an explicit need the existing stack cannot meet.

## Quality checks

- [ ] `next build`, lint, and typecheck pass using the project's own scripts.
- [ ] The client bundle contains only genuinely interactive leaves.
- [ ] No hydration mismatch or browser console error in either locale.
- [ ] `lang` and `dir` match the active locale on the rendered `<html>`.
- [ ] Deep links, browser back, and refresh preserve the expected window state.
- [ ] Loading, error, and not-found views exist and are localized.

See also: `seo`, `performance`, `code-review`.
