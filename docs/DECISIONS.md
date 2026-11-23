# Decisions

- **npm** - standard Vercel/CI compatibility.
- **Typed TS/JSON content + Zod** - one validated loader path; no MDX toolchain in V1.
- **Developer OS at `/[locale]/os`** - real shareable route; landing remains server-first.
- **Dark default with stored user choice** - no system override; avoids FOUC and spec contradiction.
- **Resend via `fetch`** - env-activated only; no paid SDK dependency; disabled fallback is honest.
- **No linked worktree** - repo started empty; feature branch isolation used.
- **Quote API at `/api/quote`** - avoids Next route/page conflict at localized quote path.
- **Nonce CSP in `src/proxy.ts`** - security headers enforced; layout forced dynamic and reads nonce for inline theme/JSON-LD scripts.
- **Root sitemap/robots file conventions** - locale alternates include `x-default`; private surfaces excluded.
- **JSON-LD from config only** - Person/WebSite/BreadcrumbList omit unconfigured fields; no invented identity/contact data.
- **Accessibility/perf hardening** - axe/keyboard/RTL/mobile checks added; bundle budget script based on Next build-manifest root chunks.
