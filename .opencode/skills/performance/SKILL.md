---
name: performance
description: Use when diagnosing or improving bundle size, hydration cost, Core Web Vitals, image and font loading, or animation cost in the Next.js portfolio — covers server components, dynamic imports, Lucide and Framer Motion weight, and theme switch stability.
---

# Performance

The portfolio should feel like a fast local application. Keep JavaScript on the wire small, keep the document stable while it loads, and measure before optimizing.

## Scope

Own bundle, hydration, loading, and rendering cost. Component boundaries are `nextjs-development`; motion technique is `motion-design`; metadata factors are `seo`.

## Design principles

- **Measure first.** Use the output of `next build`, browser DevTools, Lighthouse, and React Profiler. Targets worth watching: LCP under 2.5s, CLS under 0.1, INP under 200ms — treat these as signals, not guarantees.
- **Hydration is a budget.** Static project prose, headings, and metadata belong in Server Components. Only the OS shell pieces that handle input or animation need client code.
- **Ship icons individually.** Import named Lucide icons directly and avoid re-export barrels. Load Framer Motion only in components that actually animate.
- **Reserve space.** Window openings, font swaps, and theme changes must not shift the page. Set image dimensions, use `next/font` with `display: swap`, and size containers before content arrives.
- **Compositor-friendly rendering.** Animate transform and opacity; avoid animating layout properties or large blurred shadows on every frame.

## Workflow

1. Record a baseline under fixed conditions — same route, viewport, locale, and throttling.
2. Attribute the cost to a route or component using build output and profiling.
3. Apply the smallest change that addresses that cost, such as moving a boundary or deferring a widget.
4. Re-measure under the same conditions and keep a short before-and-after note.
5. Re-check both locales and both themes, since fonts and theme tokens can change the result.

## Coding standards

- Use `next/dynamic` for heavy, genuinely client-only windows. Do not disable SSR for content that should be crawlable.
- Keep context providers narrow; a provider that wraps the whole app forces unnecessary hydration.
- Use `next/image` with `sizes` and explicit dimensions. Do not use a raw `<img>` for portfolio imagery.
- Load only the font subsets the site renders; include Arabic glyph coverage where Arabic copy appears.
- Memoization is a response to a measured render cost, not a default styling choice.

## Constraints

- No new packages just to measure once or to optimize a single component. Prefer tooling that is already in `package.json` or the browser.
- No lazy-loading above-the-fold content, no hiding content to improve metrics, and no removing all animation — use reduced motion instead.
- No client-side fetching of static content, and no large JSON payload passed across the server/client boundary.
- Do not trade away accessibility or correct theming for a marginal score gain.

## Quality checks

- [ ] Client bundle size is known and no single route regresses it unexpectedly.
- [ ] LCP element is identified and loads without a late layout shift.
- [ ] CLS stays near zero through font load, theme switch, and window open.
- [ ] Icons are tree-shaken and Framer Motion appears only where used.
- [ ] Images have dimensions and `sizes`; fonts use `next/font`.
- [ ] Profiling shows no repeated renders caused by context or unstable props.

See also: `nextjs-development`, `motion-design`, `seo`.
