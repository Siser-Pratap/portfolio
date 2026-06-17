export type BlogPost = {
  slug: string
  label: string
  date: string
  title: string
  excerpt: string
  image: string
  content: string // HTML-safe string, rendered with dangerouslySetInnerHTML
}

export const blogPosts: BlogPost[] = [
  {
    slug: "why-nextjs-first",
    label: "Tech",
    date: "May 12, 2025",
    title: "Why I Reach for Next.js First: Server Components, Caching, and the App Router",
    excerpt:
      "Next.js 14's App Router changed the way I think about data fetching. Here's why I reach for it on nearly every new project.",
    image: "/visionweave.jpg",
    content: `
      <p>When the App Router landed in Next.js 13, I was skeptical. Pages Router worked — why change it? After shipping three production apps with the new model, I've changed my mind completely.</p>

      <h2>Server Components by default</h2>
      <p>The single biggest shift is that components are server-rendered by default. This means your database queries, API calls, and heavy computation happen on the server with zero JavaScript shipped to the client. The impact on First Contentful Paint is measurable — one client project dropped from 3.4s to 0.9s just by moving data fetching out of <code>useEffect</code>.</p>

      <h2>The caching model</h2>
      <p>Next.js 14 introduced an aggressive caching model: fetch calls are deduplicated, Time-based Revalidation is built-in, and On-demand Revalidation via <code>revalidatePath</code> makes cache invalidation trivial. No Redis, no custom cache layer.</p>

      <h2>When I reach for something else</h2>
      <p>Next.js isn't always the answer. For highly interactive SPAs with complex client state, plain Vite + React can be simpler. For pure APIs, Node.js / Express gives you more control. But for content-heavy, SEO-critical, full-stack web apps? Next.js is my default — and it keeps getting better.</p>
    `,
  },
  {
    slug: "realtime-webrtc-stream",
    label: "Web",
    date: "March 28, 2025",
    title: "Building Real-Time Features with WebSockets and Stream SDK",
    excerpt:
      "How I built MeetPro's video conferencing layer using Stream's SDK and what I learned about real-time architecture.",
    image: "/meetPro.jpg",
    content: `
      <p>Building MeetPro taught me more about real-time architecture than any tutorial could. Stream SDK handles the heavy lifting, but understanding what's happening underneath is critical when things go wrong.</p>

      <h2>Why Stream over raw WebRTC</h2>
      <p>Raw WebRTC is powerful but brutal to scale. You're responsible for signalling servers, TURN/STUN configuration, codec negotiation, and media quality adaptation. Stream abstracts all of this while giving you access to low-level hooks when you need them. For MeetPro, this meant shipping video conferencing in days instead of months.</p>

      <h2>Handling connection state in React</h2>
      <p>The trickiest part wasn't the video itself — it was managing connection state across components. I built a custom <code>useCallState</code> hook that wraps Stream's client, exposing connection status, participant list, and media tracks in a reactive, easy-to-consume API.</p>

      <h2>Lessons learned</h2>
      <p>Real-time features surface bugs that unit tests can't catch. I now run integration tests that simulate two browser sessions and assert on the video/audio state. It's slower to set up but catches race conditions before production.</p>
    `,
  },
  {
    slug: "shipping-intelai",
    label: "AI",
    date: "January 15, 2025",
    title: "Shipping an AI Chat Platform: Lessons from Building IntelAI",
    excerpt:
      "What I learned building IntelAI — from streaming LLM responses to managing conversation history at scale.",
    image: "/intelai.jpg",
    content: `
      <p>IntelAI started as a weekend experiment and turned into one of my most technically interesting projects. Here's what I'd do differently if I were starting today.</p>

      <h2>Streaming responses</h2>
      <p>Users hate waiting for a complete response. Streaming — where the model outputs tokens as they're generated — dramatically improves perceived performance. In Next.js, this is surprisingly clean: <code>ReadableStream</code> + <code>Response</code> with the <code>stream</code> option handles the heavy lifting. On the client, <code>fetch</code> with a <code>reader</code> lets you update the UI token by token.</p>

      <h2>Managing conversation history</h2>
      <p>LLMs are stateless. Every request needs to include the full conversation history to maintain context. This has cost implications — long conversations burn tokens fast. I implemented a sliding window that keeps the last N messages plus a persistent system prompt, trimming the middle when the context gets too long.</p>

      <h2>What I'd change</h2>
      <p>I'd reach for the Vercel AI SDK from the start. It handles streaming, tool calls, and provider abstraction out of the box. The primitives I built manually are all there, better tested and maintained. Save your energy for the product, not the plumbing.</p>
    `,
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug)
}
