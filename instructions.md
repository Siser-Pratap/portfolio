# Portfolio — Review, Opinions & Phased Plan

## Overview

The portfolio is built with **Next.js 14, TypeScript, Tailwind CSS, GSAP, Framer Motion, and Three.js**. The design language is strong — dark `#0D0505` background, white text, and a bold orange-red accent (`#FF4B1F`). The visual identity and layout are solid, but there are content placeholders, technical bugs, and missing sections that need to be addressed before this can ship.

The active page lives in `src/app/page.tsx` and uses the `/components/reconstructed/` set. The older components in `/components/` root are unused and can be archived.

---

## Opinions

### What's Working
- The hero layout (full-viewport portrait + split typography) is bold and distinctive.
- Color palette and typography scale are clean and consistent.
- The footer with the massive italic `Siser.` wordmark is a strong closer.
- Loader animation (GSAP progress bar) sets the right tone on entry.
- The `constants/constant.ts` approach for centralizing data is good — keep extending it.

### What Needs Fixing

**Content Placeholders (critical — these are visible to clients)**
- All 3 testimonials use your own profile photo (`/photo.jpg`) with fake names. Either get real testimonials with real photos or remove this section until real ones exist.
- All 3 blog posts have the same title and use your profile photo as the cover. Either connect to a real blog or replace with a "coming soon" state.
- Contact section has a fake phone number `+(2)579 -1245-893` and "New York, USA" as location.
- Footer shows a different fake number `+39 204 12312`.
- ClientLogos strip shows 6× "LOGOIPSUM" — replace with real client/brand logos or remove the section.
- The "Q4 '25" availability badge in the About section is outdated (it's mid-2026).
- Services cards have placeholder diamond icons instead of using the actual icon images imported in `constant.ts`.
- About section copy reads like a branding agency ("Building brands...") rather than a software developer's portfolio — the copy needs to reflect your actual work.

**Technical Bugs**
- **Dual loader conflict**: `layout.tsx` wraps children in `<Preloader>` (blocks scroll on page load) AND `page.tsx` has its own `<Loader>` component. Both run simultaneously, causing a double-block on scroll. Remove the `<Preloader>` wrapper from `layout.tsx`.
- **Hero CTA is not a link**: The "Schedule a Free Call" button in the hero is a plain `<div>` with no `href`. It should link to your Calendly (`https://calendly.com/siserpratap`).
- **Contact form does nothing**: `@emailjs/browser` is installed but not wired up. The form just calls `e.preventDefault()`.
- **Testimonials switcher is broken**: The `[04]` index and the bottom name buttons are hardcoded and have no state — clicking them does nothing.
- **Header has no scroll state**: It's `position: absolute` and never becomes sticky or changes appearance on scroll.
- **Projects show no info**: Cards display an image and category tag only — no title, description, tech stack, or links to live/GitHub.

**Missing Sections**
- **Experience / Work History** — exists in `constant.ts` with 3 real entries but is not on the page.
- **Skills** — exists in `constant.ts` with 17 entries but is not on the page.
- **Mobile navigation** — Header has no hamburger menu; the nav disappears on mobile.

---

## Phased Development Plan

### Phase 1 — Fix the Foundation
*Goal: No visible bugs, no placeholder content, all CTAs functional.*

- [ ] Remove `<Preloader>` from `layout.tsx` — the reconstructed `<Loader>` handles this already.
- [ ] Fix Hero "Schedule a Free Call" button — wrap in `<a href="https://calendly.com/siserpratap" target="_blank">`.
- [ ] Wire up Contact form with EmailJS — use `@emailjs/browser` already installed, add service/template/public key via `.env.local`.
- [ ] Replace fake contact info — update phone, email, and address in `Contact.tsx` and `Footer.tsx` to real values.
- [ ] Fix Services icons — replace the placeholder `rotate-45 div` with the actual `<Image>` icons already imported from `constant.ts`.
- [ ] Fix Services card description — each card should have a unique, relevant description pulled from constants.
- [ ] Update About copy — rewrite to reflect software development identity, not a branding agency tone.
- [ ] Update "Q4 '25" badge — change to current availability (e.g., "Available Now" or a real quarter).
- [ ] Fix stats — verify "75+ Projects", "99% Customer Satisfaction", "30+ Global Clients" are accurate or adjust.
- [ ] Testimonials — either get 3 real testimonials with real photos, or simplify to a single honest quote and remove the broken switcher.
- [ ] Blogs — replace duplicate/fake entries with real article links, or swap section for a "Writing coming soon" placeholder.
- [ ] ClientLogos — replace with real client/company logos or remove the strip entirely.

### Phase 2 — Add Missing Sections
*Goal: The page tells the full professional story.*

- [ ] **Experience section** — Build a timeline component using the `experiences` array from `constant.ts`. Place it between Services and Projects.
- [ ] **Skills section** — Build a skills grid/bar visualization using the `skills` array from `constant.ts`. Place it after Experience.
- [ ] **Mobile navigation** — Add hamburger menu to `Header.tsx` with a slide-in drawer using Framer Motion or Radix UI Sheet.
- [ ] **Resume/CV download** — Add a "Download Resume" button to About or Hero. Host the PDF in `/public/`.

### Phase 3 — Interactions & Polish
*Goal: The site feels alive and professional on interaction.*

- [ ] **Sticky header** — Make header `position: fixed`, add a glassy backdrop (`backdrop-blur`) that appears on scroll past the hero.
- [ ] **Header active link state** — Highlight the active nav item based on scroll position using IntersectionObserver.
- [ ] **Project cards** — Add hover overlay to each project card showing title, description, tech stack, and links (live + GitHub). Use Framer Motion for the overlay animation.
- [ ] **Testimonials carousel** — Wire up the name buttons to actually switch testimonials using `useState`.
- [ ] **ClientLogos marquee** — Add an infinite horizontal scroll animation with CSS or Framer Motion.
- [ ] **Scroll-triggered animations** — Add Framer Motion `whileInView` entrance animations to section headings and cards (already installed, not yet used in reconstructed components).
- [ ] **Smooth scroll** — Add `scroll-behavior: smooth` in globals.css and verify anchor links work correctly.

### Phase 4 — Advanced & Nice-to-Have
*Goal: Memorable, technically impressive details.*

- [ ] **Three.js accent** — Use the existing `scene.gltf` model (planet/globe) as a background element in the hero or feature banner.
- [ ] **Blog with MDX** — Set up `next-mdx-remote` or a simple MDX page route to publish real writing.
- [ ] **Dark/light mode toggle** — `next-themes` is installed; wire up a toggle in the header.
- [ ] **OG image / SEO** — Add `opengraph-image.tsx` using Next.js App Router conventions. Update metadata with real description and keywords.
- [ ] **Performance audit** — Run Lighthouse; optimize images with Next.js `<Image>` sizes prop, add `loading="lazy"` where appropriate.
- [ ] **GitHub activity widget** — Embed a live contribution graph or latest repo cards as a social proof element.

---

## File Reference

| Area | File |
|---|---|
| Page root | `src/app/page.tsx` |
| Layout / metadata | `src/app/layout.tsx` |
| All data (projects, skills, experience) | `constants/constant.ts` |
| Loader (keep this one) | `components/reconstructed/Loader.tsx` |
| Redundant preloader (remove from layout) | `components/preloader.tsx` |
| Header | `components/reconstructed/Header.tsx` |
| Hero | `components/reconstructed/Hero.tsx` |
| About | `components/reconstructed/About.tsx` |
| Services | `components/reconstructed/Services.tsx` |
| Projects | `components/reconstructed/Projects.tsx` |
| Testimonials | `components/reconstructed/Testimonials.tsx` |
| Blogs | `components/reconstructed/Blogs.tsx` |
| Contact | `components/reconstructed/Contact.tsx` |
| Footer | `components/reconstructed/Footer.tsx` |
| Client Logos | `components/reconstructed/ClientLogos.tsx` |
| Feature Banner | `components/reconstructed/FeatureBanner.tsx` |
