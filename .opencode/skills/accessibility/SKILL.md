---
name: accessibility
description: Use when reviewing or fixing keyboard access, focus management, ARIA semantics, color contrast, or RTL reading order in the Developer OS portfolio — includes dialog windows, taskbar, icon-only buttons, and dark and light themes.
---

# Accessibility

The Developer OS metaphor must not become a barrier. A visitor using a keyboard, a screen reader, reduced motion, or Arabic RTL gets the same content and the same control over windows.

## Scope

Own semantics, keyboard behavior, focus, contrast, and locale reading order. Visual styling is `frontend-design`; animation fallbacks are `motion-design`.

## Design principles

- **Native elements first.** A launcher is a `<button>`, navigation is `<nav>`, and a window is a section with `role="dialog"`. Use `aria-modal` only when the window truly blocks the rest of the page.
- **Focus has a trajectory.** Opening a window moves focus to its first meaningful control, focus stays inside a modal, and closing it returns focus to the launcher. Never trap focus in a non-modal window.
- **Every icon speaks.** Decorative Lucide icons are `aria-hidden`; icon-only buttons carry `aria-label` from the locale catalog, including window close, minimize, theme toggle, and language switch.
- **Logical properties mirror layout.** Use `ms-*`, `me-*`, `ps-*`, `pe-*`, and `text-start` so spacing and alignment follow `dir`. Mirror arrows and chevrons, but keep code blocks and code samples `dir="ltr"`.
- **Contrast is per theme.** Aim for 4.5:1 on body text and 3:1 on large text, UI borders, and icon strokes in both dark and light themes. Never signal state with color alone.
- **Motion is optional.** Reduced-motion users receive the same information through opacity or instant state changes.

## Workflow

1. List every interactive element in the surface, including window chrome and taskbar items.
2. Traverse the flow using Tab, Shift+Tab, Enter, Space, Arrow keys where relevant, and Escape.
3. Listen with a screen reader and confirm names, roles, and reading order match the visual order.
4. Test with `dir="rtl"` and `lang="ar"`, then repeat in dark and light themes.
5. Run the project's existing automated accessibility check if one is configured; do not add a package for a single audit.
6. Record any intentional exception with the reason and an equivalent alternative.

## Coding standards

- Focus rings are visible in both themes, at least 2px with an offset. Never remove `outline` without a replacement style.
- Use `aria-live="polite"` for window status and form submission results, and `aria-busy` while work is in flight.
- Every form control has a programmatic label and, where helpful, `aria-describedby` pointing at localized help or error text.
- Interactive targets are at least 44 by 44 CSS pixels on touch layouts, including taskbar icons.
- `tabindex` greater than zero is not used; DOM order defines tab order.
- `<html lang>` and `<html dir>` track the active locale; inline foreign-language snippets set their own `lang`.

## Constraints

- No clickable `<div>` standing in for a button unless the full keyboard and ARIA contract is implemented.
- No auto-focus on page load, no focus lost on window close, no hidden-but-focusable controls behind closed windows.
- No `aria-label` that contradicts visible text, and no duplicate labels that make taskbar items indistinguishable.
- No new accessibility dependency purely to satisfy one check.

## Quality checks

- [ ] The full journey from landing to contact works without a mouse.
- [ ] Escape closes the topmost window or menu and focus returns to its trigger.
- [ ] Screen reader output names every launcher, window, and icon-only control correctly.
- [ ] Heading order is sequential and there is a skip link to main content.
- [ ] Arabic layout mirrors visually and in reading order; code stays LTR.
- [ ] Contrast meets AA in both themes and status is never color-only.
- [ ] Reduced motion is on and all state changes remain perceivable.

See also: `ui-ux`, `motion-design`, `frontend-design`.
