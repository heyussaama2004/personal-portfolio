---
name: ui-ux
description: Use when designing navigation, interaction flows, or state handling for the Developer OS portfolio — covers window and taskbar behavior, command palette, empty and error states, keyboard paths, and responsive or RTL rearrangements.
---

# UI and UX

The portfolio is a small operating system: people launch apps, read project windows, and leave through a contact window. Optimize for finishing that journey, not for exploring a metaphor.

## Scope

Own task flows, state models, feedback, and microcopy. Visual tokens belong to `frontend-design`; animation belongs to `motion-design`; accessible semantics belong to `accessibility`.

## Design principles

- **One window, one question.** About answers who, Projects answers what, Experience answers where, Contact answers how. Do not split one answer across three windows or force three answers into one.
- **Explicit window rules.** Exactly one focused window at a time. Opening a launcher adds it to the taskbar; closing it restores focus to the launcher that opened it. Escape closes the topmost overlay.
- **Progressive disclosure.** The desktop shows a headline, launchers, and a hint of recent work. Depth lives inside windows so the landing view never becomes a scroll marathon.
- **Every action answers back.** Hover, focus, pressed, busy, success, and failure states are specified together — especially for contact form submission and external links.
- **Copy earns its space.** Short, concrete, active voice in the visitor's language. Use i18n keys; never ship English strings in the Arabic path or write "click here".
- **Mobile is a different arrangement, not a shrunken desktop.** Windows become full-screen sheets, the taskbar becomes a bottom dock, and no action depends on drag, hover, or right-click alone.
- **RTL changes direction, not structure.** In Arabic, mirror the reading flow: back chevrons point right, progress advances leftward, and code samples stay LTR.

## Workflow

1. Write the user task and its entry point — launcher, taskbar item, command palette, or deep link.
2. Enumerate states: default, hover, focus, loading, empty, error, success, and offline where relevant.
3. Define recovery: close, Escape, breadcrumb, retry, and what happens on browser back.
4. Describe the keyboard and screen-reader path next to the pointer path, not as an afterthought.
5. Check the 320px layout and the Arabic locale before implementation is considered complete.
6. Hand visual specifics to `frontend-design` and transition specifics to `motion-design`.

## Coding standards

- Model multi-state UI with a discriminated union or explicit state machine; avoid stacks of unrelated booleans such as `isOpen`, `isClosing`, and `hasOpened`.
- Derive taskbar entries and active-window styling from one window state source. Never synchronize two copies with effects.
- Event handlers are typed and thin; decisions live in named functions, not inline JSX expressions.
- All user-facing strings resolve through the typed locale catalog, including placeholders, errors, and `aria-label` values.
- Async actions expose status explicitly so the UI can render busy and retry states without guessing.

## Constraints

- No click-only affordances, no auto-opening windows on page load, no hover-only primary navigation.
- No infinite scroll for a finite project list; paginate or show everything.
- No new state-management library. Local state and the existing context are sufficient for window state.
- Do not make understanding a state depend on animation; reduced-motion users get the same information.

## Quality checks

- [ ] A visitor can open a window, read it, and reach contact using only the keyboard.
- [ ] Closing a window returns focus to its launcher and updates the taskbar.
- [ ] Empty, error, and retry copy exists in every supported locale.
- [ ] Browser back and deep links land on the correct window state.
- [ ] At 320px, windows and dock do not overlap or trap the visitor.
- [ ] Arabic navigation order and chevron direction are mirrored; code snippets remain LTR.
- [ ] No action is signalled by color or icon alone.

See also: `frontend-design`, `accessibility`, `motion-design`.
