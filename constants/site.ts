// ─── Site identity ────────────────────────────────────────────────────────────
// Single source of truth for the canonical URL, name, and social profiles.
// Nothing else in the codebase should hardcode the domain — import from here so
// a future domain change is a one-line edit.
//
// Operational config (booking hours, phone, resume links) lives in settings.ts;
// contact details are re-exported from there rather than duplicated.

import { SETTINGS } from "./settings"

export const SITE = {
  /** Canonical origin. No trailing slash. */
  url: "https://siserpratap.in",

  name: "Siser Pratap",
  shortName: "Siser",

  /** Query variants people actually type. Fed to Person.alternateName in JSON-LD. */
  alternateNames: ["Siser", "Siser Pratap", "siserpratap", "Siser P."],

  title: "Siser Pratap — Full Stack & AI Developer",
  description:
    "Siser Pratap is a full stack developer in Gurugram, India, building production web apps and AI systems with React, Next.js, Node.js, Python and FastAPI. Open to freelance work worldwide.",

  jobTitle: "Software Development Engineer",

  employer: {
    name: "M37Labs",
  },

  /** Split out for schema.org PostalAddress. */
  location: {
    locality: "Gurugram",
    region: "Haryana",
    country: "IN",
    /** Human-readable form, kept in sync with settings.ts. */
    display: SETTINGS.location,
  },

  email: SETTINGS.email,

  /** Portrait used for Person.image and as the OG fallback. */
  image: "/photo.jpg",

  twitterHandle: "@PratapSiser",

  /**
   * Topics the entity is associated with. Feeds Person.knowsAbout in JSON-LD —
   * this is how Google connects the person to the technology space rather than
   * treating the name as an unclassified string.
   */
  knowsAbout: [
    "Full Stack Development",
    "React",
    "Next.js",
    "Node.js",
    "TypeScript",
    "JavaScript",
    "Python",
    "FastAPI",
    "Django",
    "Nest.js",
    "Three.js",
    "PostgreSQL",
    "MongoDB",
    "AWS",
    "Docker",
    "REST APIs",
    "System Design",
    "Generative AI",
    "Large Language Models",
    "Computer Vision",
    "Machine Learning",
  ],

  social: {
    github: "https://github.com/Siser-Pratap",
    linkedin: "https://www.linkedin.com/in/siser",
    x: "https://x.com/PratapSiser",
    instagram: "https://www.instagram.com/siser_ins17",
    npm: "https://www.npmjs.com/package/authence",
  },
} as const

/**
 * Profiles asserted as the same entity. Google uses this to merge the domain
 * with the GitHub/LinkedIn profiles that already rank for the name — which is
 * what makes a name query resolve here rather than to a third-party profile.
 */
export const SAME_AS: string[] = Object.values(SITE.social)

/** Absolute URL for a site-relative path. Safe to pass an already-absolute URL. */
export function absoluteUrl(path = "/"): string {
  return new URL(path, SITE.url).toString()
}
