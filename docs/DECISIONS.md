# Decisions

- **npm** — standard Vercel/CI compatibility; no extra package manager requirement.
- **Typed TypeScript content instead of MDX in V1** — one Zod-validated loader path, no MDX toolchain. Long-form project bodies use structured highlights until MDX is needed.
- **Developer OS as `/[locale]/os`** — real shareable and crawlable route; landing remains static and light.
- **Dark default with stored choice** — avoids contradicting the brief's dark default and prevents a flash of the wrong theme; system preference does not override the default.
- **Resend via `fetch`** — activated only by env vars; avoids a paid-tier SDK dependency.
- **Feature branch, no linked worktree** — repository started empty; there was no branch state to protect.
