// ─── JSON-LD builders ─────────────────────────────────────────────────────────
// Structured data is what turns "a site that mentions Siser Pratap" into "the
// authoritative site OF the person Siser Pratap". Entities are given stable @id
// values and cross-referenced, so Google reads one connected graph rather than
// several loose objects.

import { SITE, SAME_AS, absoluteUrl } from "@/constants/site"

/** Stable entity identifiers. Referenced across pages so the graph stays joined. */
export const ID = {
  person: `${SITE.url}/#person`,
  website: `${SITE.url}/#website`,
  profilePage: `${SITE.url}/#profilepage`,
} as const

export function personSchema() {
  return {
    "@type": "Person",
    "@id": ID.person,
    name: SITE.name,
    // Catches the query variants people actually type — bare "Siser",
    // "siserpratap", and the full name.
    alternateName: [...SITE.alternateNames],
    url: SITE.url,
    image: {
      "@type": "ImageObject",
      url: absoluteUrl(SITE.image),
      caption: `${SITE.name}, ${SITE.jobTitle}`,
    },
    description: SITE.description,
    jobTitle: SITE.jobTitle,
    email: `mailto:${SITE.email}`,
    worksFor: {
      "@type": "Organization",
      name: SITE.employer.name,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.location.locality,
      addressRegion: SITE.location.region,
      addressCountry: SITE.location.country,
    },
    nationality: {
      "@type": "Country",
      name: "India",
    },
    knowsAbout: [...SITE.knowsAbout],
    // The load-bearing field: asserts these profiles are the same entity, which
    // is how the domain inherits the authority of profiles already ranking for
    // the name. Requires the reciprocal link back (see SEO_PLAN.md Phase 7.3).
    sameAs: SAME_AS,
  }
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": ID.website,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    inLanguage: "en",
    publisher: { "@id": ID.person },
    copyrightHolder: { "@id": ID.person },
  }
}

/**
 * Google's recommended type for a page that is about a single person.
 * `mainEntity` is what states "this page IS this person".
 */
export function profilePageSchema() {
  return {
    "@type": "ProfilePage",
    "@id": ID.profilePage,
    url: SITE.url,
    name: SITE.title,
    description: SITE.description,
    isPartOf: { "@id": ID.website },
    about: { "@id": ID.person },
    mainEntity: { "@id": ID.person },
    inLanguage: "en",
  }
}

/** Renders the breadcrumb trail in search results in place of a raw URL. */
export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function blogPostingSchema(post: {
  slug: string
  title: string
  excerpt: string
  date: string
  image: string
}) {
  const published = new Date(post.date)
  const url = absoluteUrl(`/blog/${post.slug}`)

  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.excerpt,
    image: absoluteUrl(post.image),
    // Attributing authorship to the Person @id — not a bare string — is what
    // makes each post reinforce the entity instead of floating free.
    author: { "@id": ID.person },
    publisher: { "@id": ID.person },
    ...(Number.isNaN(published.getTime())
      ? {}
      : {
          datePublished: published.toISOString(),
          dateModified: published.toISOString(),
        }),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    isPartOf: { "@id": ID.website },
    inLanguage: "en",
  }
}

/** Wraps entities in a single @graph so one script tag carries the whole set. */
export function graph(...nodes: object[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  }
}
