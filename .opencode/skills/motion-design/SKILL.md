---
name: motion-design
description: Use when adding or reviewing Framer Motion animation in the portfolio — covers window open and close transitions, staggered entrances, taskbar feedback, layout animations, reduced-motion fallbacks, and animation performance.
---

# Motion Design

Motion in a Developer OS explains a state change: a window appeared, a menu closed, a launcher responded. If it does not explain anything, remove it.

## Scope

Own Framer Motion usage and timing. Surface appearance belongs to `frontend-design`; interaction rules belong to `ui-ux`.

## Design principles

- **Transform and opacity only.** Animate `x`, `y`, `scale`, `rotate`, and `opacity`. Avoid animating `width`, `height`, `top`, `left`, or `box-shadow`.
- **Short and physical.** Window entrances land in 180–260ms; springs around stiffness 350–500, damping 30–40, mass near 0.8. Utility UI should not bounce.
- **Stagger with restraint.** Only stagger sets of three or more related items, such as launcher icons, and keep the whole sequence under roughly 400ms.
- **Exits are part of the interface.** Use `AnimatePresence` with stable unique keys so closing windows and menus are seen, not cut.
- **Reduced motion is a variant, not a deletion.** Replace movement with an opacity fade or instant state; content and feedback remain identical.
- **Direction-neutral by default.** Prefer scale and opacity over horizontal offsets. If a slide is essential, derive its sign from the active `dir` so Arabic RTL does not animate backwards.

## Reference implementation

```tsx
"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import type { ReactNode } from "react"

type MotionWindowProps = {
  windowKey: string
  label: string
  open: boolean
  children: ReactNode
}

export function MotionWindow({ windowKey, label, open, children }: MotionWindowProps) {
  const reduceMotion = useReducedMotion()

  return (
    <AnimatePresence>
      {open && (
        <motion.section
          key={windowKey}
          role="dialog"
          aria-label={label}
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: 6 }}
          transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.8 }}
          className="rounded-xl border border-border bg-surface p-5 shadow-lg"
        >
          {children}
        </motion.section>
      )}
    </AnimatePresence>
  )
}
```

Token names in the example are illustrative; use the project's own Tailwind theme keys.

## Workflow

1. Classify the transition: enter, exit, reorder, or feedback.
2. Choose the smallest property set that communicates it.
3. Write the reduced-motion variant before wiring the animation.
4. Co-locate named variants with the component and keep keys stable across renders.
5. Profile with browser DevTools and confirm no layout shift or forced reflow.
6. Verify with reduced motion enabled, in both themes, and in Arabic RTL.

## Coding standards

- `motion` components live in client components; put `"use client"` at the leaf that needs it, not at the layout root.
- Variants are named objects (`windowVariants`, `launcherVariants`) rather than inline magic numbers.
- `layoutId` is reserved for genuinely shared elements, such as a launcher expanding into a window. Do not apply it to every panel.
- Never remount a component just to replay an animation; changing `key` resets its state and focus.
- Animation must not delay focus restoration when a window opens or closes.

## Constraints

- No additional animation libraries. Framer Motion is the only motion dependency.
- No infinite loops, no 3D transforms, no parallax that fights scrolling.
- Do not animate above-the-fold static content in a way that causes CLS or hides it from the initial HTML.
- Never remove an animation that conveys state without providing an equivalent non-moving cue.

## Quality checks

- [ ] With reduced motion enabled, all content and status changes are still perceivable.
- [ ] Exit animations finish before unmount; no windows vanish mid-transition.
- [ ] DevTools shows transform and opacity composition, not layout recalculation.
- [ ] CLS stays near zero when windows open and when the font loads.
- [ ] Motion reads correctly in RTL and does not assume a left-to-right slide.
- [ ] No animation delays keyboard focus or hides the focus ring.

See also: `performance`, `frontend-design`, `accessibility`.
