---
name: frontend-design
description: Use when building or restyling portfolio UI surfaces with Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, or Lucide Icons — covers Developer OS window chrome, color tokens, responsive layout, and RTL-safe component structure.
---

# Frontend Design

Design the portfolio as one coherent Developer OS, not a stack of unrelated cards. Every visible surface belongs to the shell: desktop, window, taskbar, or overlay.

## Scope

Use this for visual decisions and component composition. Motion choreography lives in `motion-design`, task flows in `ui-ux`, and semantics in `accessibility`.

## Design principles

- **Chrome implies capability.** Title bars, traffic-light controls, and status strips promise drag, close, or minimize behavior. Only draw chrome on elements that actually offer those actions.
- **One elevation language.** Define surfaces as desktop (wallpaper), panel (window body), raised (title bar and taskbar), and overlay (menus and dialogs). Combine background, border, and shadow consistently; never solve layering with ad hoc `z-*`.
- **Tokens over literals.** Colors, radii, spacing, and durations come from CSS custom properties mapped into Tailwind theme keys. Dark and light themes swap variable values, not whole class trees.
- **Icon grammar.** Lucide icons use a consistent stroke weight: 16px in inline text, 20px in window chrome, 24px in app launchers. Do not mix emoji with Lucide inside one control set.
- **Direction-agnostic geometry.** Prefer logical utilities (`ps-*`, `pe-*`, `ms-*`, `me-*`, `text-start`) so Arabic RTL mirrors the interface without a parallel stylesheet.

## Workflow

1. Name the surface and its job in one sentence — launcher, project window, terminal widget, taskbar, or context menu.
2. Map its tokens: surface, border, foreground, muted, accent, radius, shadow. Reuse existing variables; add one only when nothing fits.
3. Sketch the smallest viewport first: full-width stacked windows and a bottom dock. Desktop is the enhancement.
4. Build the primitive, then register it in the app/window registry so title, icon, and open state come from one source.
5. Inspect both themes and both directions before calling the surface finished.

## Coding standards

- Props are explicit TypeScript interfaces. No `any`, no implicit optional fields, no prop bags typed as `Record<string, unknown>`.
- Tailwind describes structure and state. Prefer `p-4`, `gap-3`, `rounded-lg` over `p-[13px]`; reserve arbitrary values for genuinely non-token geometry.
- Use the project's existing class-merge helper (for example `cn`) if present. Otherwise compose template strings directly — do not add `clsx` or `tailwind-merge` for this alone.
- Co-locate a component's variants with the component. Do not create a global styles dump file.
- Labels, project names, and copy come from typed content/i18n data, never hard-coded inside JSX.

## Constraints

- No new styling or icon packages. Tailwind, Framer Motion, and Lucide already cover the work.
- Do not change application source while exploring an advisory design question; describe the component shape first.
- No fixed widths that fail at 320px. No `overflow-hidden` used to disguise a layout error.
- Theme styling must honor both the system preference and the user's persisted choice from the existing theme provider.

## Quality checks

- [ ] The surface reads as part of the OS at a glance — chrome, spacing, and icon scale agree.
- [ ] Dark and light themes both feel intentional, not like a simple inversion.
- [ ] 320px, tablet, and wide desktop layouts remain usable; the taskbar never covers content.
- [ ] With `dir="rtl"`, chrome, breadcrumbs, and control order mirror correctly.
- [ ] Every icon-only control has an accessible name.
- [ ] No arbitrary values were introduced where a token already exists.

See also: `ui-ux`, `motion-design`, `accessibility`.
