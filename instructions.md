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

- [x] **Three.js accent** — Used the existing `scene.gltf` planet model in the hero. Reverted to original orange circle on request — `HeroModel.tsx` kept for future use.
- [x] **Blog with real pages** — 3 posts in `src/data/blogPosts.ts`, static routes at `/blog/[slug]`. Blog section links to them.
- [x] **OG image / SEO** — `src/app/opengraph-image.tsx` (edge runtime, 1200×630). Full `openGraph`, `twitter`, `keywords`, and `metadataBase` in layout.
- [x] **Performance** — Removed `images: { unoptimized: true }`, enabled AVIF + WebP. Added `sizes` prop to all critical images.
- [x] **GitHub activity widget** — `GitHubActivity.tsx` with live contribution graph (ghchart.rshah.org) and repo cards from portfolio data.
- [x] **Dark/light mode toggle** — Implemented. `next-themes` with `defaultTheme="dark"`. Originally-dark sections (Hero, SkillGraph, CodeShowcase, Footer) respond to toggle; originally-light sections stay light in both modes.

---

### Phase 5 — AI Assistant (Portfolio Differentiator)
*Goal: Let visitors talk to your portfolio. Proves AI capability in the most direct way possible.*

The single highest-impact addition. An embedded chat widget powered by the Anthropic Claude API that knows everything about you — built from your `constant.ts` data. A recruiter or client types "Does Siser know WebSockets?" and gets a real answer in seconds. It runs 24/7 and proves you can ship AI, not just list it.

- [x] **System prompt** — Built from `experiences`, `skills`, `portfolioItems`, `teamMembers` in `constant.ts`. Wired to GROQ API (`llama-3.3-70b-versatile`).
- [x] **API route** — `src/app/api/chat/route.ts` with streaming. Uses `GROQ_API_KEY` from `.env.local`.
- [x] **Chat UI** — Slide-up drawer, floating button bottom-right, streams tokens in real time.
- [ ] **Suggested prompts** — Not yet implemented. On open, show 4 quick-tap chips: "What's Siser's strongest skill?", "Tell me about IntelAI", "Is he available for freelance?", "What does he charge?" Tapping a chip should populate the input and auto-submit.
- [x] **Rate limiting** — In-memory rate limit in `api/chat/route.ts` (5 req/IP/hour via `rateLimitMap`).
- [x] **GROQ_API_KEY** — Set in `.env.local`.

---

### Phase 6 — Terminal Mode
*Goal: The thing people screenshot and share. Signals developer personality and systems thinking.*

Press `/` or `T` anywhere on the page to toggle a full-screen terminal overlay. Visitors type real commands to navigate your portfolio. No other portfolio in your category has this.

- [ ] **Command engine** — Client-side command parser. Core commands: `help`, `about`, `projects`, `skills`, `experience`, `contact`, `hire`, `clear`, `exit`.
- [ ] **Output rendering** — ASCII-styled output with your brand colors. `projects` lists items with index numbers. `projects 2` shows IntelAI detail. `skills frontend` filters by category.
- [ ] **Typewriter effect** — Commands and output use a typewriter animation to feel authentic. Built with a simple character-by-character interval, not a library.
- [ ] **Keyboard trigger** — Global `keydown` listener for `/`. ESC or `exit` command closes the overlay.
- [ ] **Easter eggs** — `sudo hire siser` outputs `Permission granted. Redirecting to Calendly...` and opens the booking link. `npm install siser-pratap` prints a fake install log.
- [ ] **Terminal UI** — Fixed overlay with a blinking cursor, command history (↑ to recall), and a fake prompt `siser@portfolio:~$`.

---

### Phase 7 — Live Project Health Indicators
*Goal: Show that what you ship, stays alive. Passive proof of DevOps awareness.*

- [ ] **Uptime dots** — Each project card in the Projects section gets a small green/amber dot. Client-side `fetch` to each live URL on mount. Green = 200, amber = slow/degraded, grey = unreachable.
- [ ] **Last deploy badge** — Pull last deployment timestamp from Vercel API (`/v6/deployments?projectName=X`) for each project. Display "Deployed 3 days ago" below the tech stack.
- [ ] **Last commit** — GitHub API `GET /repos/Siser-Pratap/{repo}/commits?per_page=1` for each project. Display relative time ("last commit 5 days ago").
- [ ] **"Currently building" strip** — A single live line in the hero or footer: "Currently building: [repo name] · last commit Xh ago" pulled from GitHub activity API. Replaces the static "Available Now" badge.

---

### Phase 8 — Code Quality Showcase
*Goal: Let your actual code speak. The thing that matters most to a technical hiring manager.*

Most portfolios show project screenshots. None show the code. This section does both.

- [ ] **"How I build" section** — 2–3 code snippets from your best work with syntax highlighting (`shiki` or `prism`). Each annotated with a one-liner explaining the *why*, not the what.
- [ ] **Snippet selection** — Candidates: the `useCallState` hook from MeetPro, the streaming handler from IntelAI, the Nodemailer API route from this portfolio, a NestJS guard or Spring Boot controller from your backend work.
- [ ] **Design** — Dark card (`#0D0505`) with a macOS-style window chrome (3 dots), language label, line numbers. Tab switching between 2–3 snippets.
- [ ] **Copy button** — One-click copy with a brief "Copied!" confirmation. Small detail, high signal.

---

### Phase 9 — Interactive Skill Graph
*Goal: Replace progress bars with something that demonstrates frontend depth and shows how your skills interconnect.*

- [ ] **Graph data** — Define nodes (skills) and edges (relationships) in `constant.ts`. Example: React → Next.js, Node.js → Express → NestJS, TypeScript → React + Node.js, Three.js → React.
- [ ] **Renderer** — D3.js force-directed graph or a lightweight vis.js network. Nodes sized by proficiency level. Hover shows proficiency %. Click filters to related skills.
- [ ] **Design** — Dark section. Nodes styled as small glowing circles in the brand orange-red. Edges as thin white lines with low opacity. Smooth physics simulation.
- [ ] **Fallback** — If JS is disabled or the graph fails to render, fall back to the existing progress bar grid.

---

### Phase 10 — Static Data Cleanup & Live Integrations
*Goal: Nothing on the page should be hardcoded if it can go stale. Every configurable string lives in one place.*

#### 10-A — Content accuracy (your side)
- [ ] **Testimonials** — All 3 use `/photo.jpg` (your own photo) with invented names. Replace with real client testimonials and real photos, or remove the section until they exist. File: `constants/constant.ts → testimonials[]`.
- [ ] **Client logos** — `ClientLogos.tsx` has 6 placeholder text entries. Add real SVG/PNG logos to `/public/logos/` and swap the `<div>` placeholders. File: `components/reconstructed/ClientLogos.tsx`.
- [ ] **Blog cover images** — The 3 blog posts reuse project screenshots (`/visionweave.jpg`, `/meetPro.jpg`, `/intelai.jpg`). Add dedicated cover images per post. File: `src/data/blogPosts.ts`.
- [ ] **Skill levels** — Many skills are copy-pasted at `88`. Audit and set accurate percentages. File: `constants/constant.ts → skills[]`.
- [ ] **Experience location** — `experiences[0].location` says `"New Delhi, India"` but `SETTINGS.location` is `"Gurugram, India"`. Align them. File: `constants/constant.ts:53`.
- [ ] **Footer social links** — Instagram, Youtube, Dribbble, Behance all point to `href="#"`. Add real URLs or remove the ones that don't exist. File: `components/reconstructed/Footer.tsx:48–51`.

#### 10-B — Centralise remaining hardcoded strings (dev side)
- [ ] **Social URLs** — `teamMembers` in `constant.ts` has social links; Footer has separate dead `href="#"` links; `TerminalMode` has inline handles. Consolidate everything into a `SETTINGS.socials` object and reference it everywhere.
- [ ] **GitHub username** — `"Siser-Pratap"` is hardcoded in `GitHubActivity.tsx` (ghchart URL, profile link), `api/github-commit/route.ts`, and `TerminalMode.tsx`. Move it to `SETTINGS.githubUsername` and replace all occurrences.
- [ ] **Copyright year** — `©2025` is hardcoded in `Projects.tsx:254`. Change to `` `©${new Date().getFullYear()}` ``.
- [ ] **TerminalMode social handles** — LinkedIn, Twitter, Instagram handles are inline strings. Reference `SETTINGS.socials` once it exists.

#### 10-C — Activate dormant integrations (env vars needed — your side)
- [ ] **Contact form SMTP** — Nodemailer is wired in `src/app/api/contact/route.ts` but needs env vars. Add to `.env.local`:
  ```
  SMTP_HOST=smtp.gmail.com
  SMTP_PORT=587
  SMTP_SECURE=false
  SMTP_USER=your@gmail.com
  SMTP_PASS=your-app-password
  SMTP_FROM="Siser Portfolio <your@gmail.com>"
  ```
- [ ] **Vercel deploy badges** — `src/app/api/vercel-deploy/route.ts` is implemented. Add `VERCEL_TOKEN=` to `.env.local`. Get token at vercel.com → Settings → Tokens.
- [ ] **GitHub rate limit** — `api/github-commit` supports `GITHUB_TOKEN` for 5000 req/hr vs 60 unauthenticated. Add `GITHUB_TOKEN=` to `.env.local`. Generate at github.com → Settings → Developer settings → Personal access tokens.

#### 10-D — Live data that could replace static numbers (dev side)
- [ ] **npm download count for Authence** — `https://api.npmjs.org/downloads/point/last-month/authence` returns live monthly downloads. Show a live "X downloads/mo" badge on the Authence project card hover overlay instead of nothing.
- [ ] **GitHub star counts** — `GET /repos/Siser-Pratap/{repo}` returns `stargazers_count`. Show a ★ count on each project card overlay alongside the uptime dot.
- [ ] **Vercel Analytics** — Add `@vercel/analytics` (already likely available if deployed on Vercel). One-line addition to `layout.tsx`. Shows visitor stats in the Vercel dashboard.

---

### Phase 11 — Bugs, Dead Code & Consistency
*Goal: No broken links, no orphaned data, no silent failures. Clean TypeScript.*

#### 11-A — Dead anchors & navigation (dev side)
- [ ] **Footer `#article` anchor** — `href="#article"` in `Footer.tsx:41` points to nothing. The blogs section has `id="blogs"`. Change to `href="#blogs"`. File: `components/reconstructed/Footer.tsx`.
- [ ] **Footer social `href="#"`** — Instagram, Youtube, Dribbble, Behance all point to `#`. Wire to real URLs once added to `SETTINGS.socials` (Phase 10-B), or remove the links until profiles exist. File: `components/reconstructed/Footer.tsx:48–51`.
- [ ] **`navItems` and `sections` in `constant.ts` are orphaned** — The header uses its own hardcoded nav array; `navItems` and `sections` from `constant.ts` are never imported. Either delete them or make the header consume `navItems`. Files: `constants/constant.ts:1–21`, `components/reconstructed/Header.tsx`.
- [ ] **`sections` includes `"socials"` and `"skills"` separately** — Neither exists as a page section ID. `SkillGraph` uses `id="skills"` but there is no `id="socials"` section. Remove or reconcile. File: `constants/constant.ts`.
- [ ] **`filters` array has `"Algorithmic"`** — No portfolio item uses this category, and there is no filter UI on the Projects section. Remove the `filters` export or build filter UI to match. File: `constants/constant.ts`.

#### 11-B — Data integrity (your side + dev side)
- [ ] **`teamMembers` Dribbble link points to Calendly** — `{ icon: Dribbble, link: "https://calendly.com/siserpratap" }` in `constant.ts:128`. Replace with a real Dribbble URL or change the icon to `Calendar`. File: `constants/constant.ts:128`.
- [ ] **Contact form sends to `SMTP_USER` not your inbox** — `to: process.env.SMTP_USER` in `api/contact/route.ts:24` sends replies to the sending account. Add `SMTP_TO=your@email.com` to `.env.local` and change `to:` to `process.env.SMTP_TO ?? process.env.SMTP_USER`. File: `src/app/api/contact/route.ts`.
- [ ] **`experiences[0].location` says "New Delhi, India"** — Conflicts with `SETTINGS.location = "Gurugram, India"`. The Experience section and TerminalMode both show "New Delhi". Align to one value. File: `constants/constant.ts:53`.

#### 11-C — TypeScript errors (dev side)
- [ ] **`scroll-controller.tsx(136)`** — `Variable 'animationFrame' is used before being assigned`. Initialise as `let animationFrame: number | undefined` to fix.
- [ ] **`hooks/use-toast.ts(9)`** — `Cannot find module '@/components/ui/toast'`. The shadcn toast component it depends on was never generated. Either run `npx shadcn-ui@latest add toast` or remove/replace the hook.
- [ ] **`hooks/use-toast.ts(161)`** — `Parameter 'open' implicitly has 'any' type`. Add `: boolean` annotation. Downstream from the missing module above — resolves automatically once the toast module is added.

#### 11-D — Chat assistant polish (dev side)
- [ ] **Suggested prompts** — See Phase 5. On open, show 4 quick-tap chips below the empty message list. Tapping auto-fills the input and submits. Disappear after the first message is sent.

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
