import type { Transition, Variants } from "framer-motion"

/**
 * One easing curve and one rhythm for the whole booking flow, so nothing feels
 * like it came from a different page.
 *
 * Reduced motion is handled globally by <MotionConfig reducedMotion="user">,
 * which strips transform/layout animation and keeps opacity — so these values
 * never need a conditional.
 */
export const EASE = [0.16, 1, 0.3, 1] as const

export const base: Transition = { duration: 0.5, ease: EASE }

/** Page-level column: children fall in one after another. */
export const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

/**
 * `MotionConfig reducedMotion="user"` stops transforms from *animating*, but
 * still applies the offset statically — which turns a 40px slide into a 40px
 * jump. Passing `distance: 0` is what actually reduces these to a pure fade,
 * so both take the distance from the caller's `useReducedMotion()`.
 */
export const riseIn = (distance = 24): Variants => ({
  hidden: { opacity: 0, y: distance },
  show: { opacity: 1, y: 0, transition: base },
})

/**
 * Step-to-step slide. `custom` is +1 going forward, -1 going back, so the
 * panel always travels in the direction the visitor is moving.
 */
export const stepSlide = (distance = 40): Variants => ({
  enter: (direction: number) => ({ opacity: 0, x: direction * distance }),
  center: { opacity: 1, x: 0, transition: base },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction * -distance,
    transition: { duration: 0.28, ease: EASE },
  }),
})

/** Grids that fill in cell by cell (calendar days, time slots). */
export const grid = (stagger: number): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger } },
})

export const cell: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE } },
}

/** Shared layout ids — kept here so two components can't collide on a name. */
export const LAYOUT = {
  stepPill: "booking-step-pill",
  durationPill: "booking-duration-pill",
  daySelect: "booking-day-select",
  slotSelect: "booking-slot-select",
} as const
