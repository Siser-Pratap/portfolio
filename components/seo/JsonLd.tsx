/**
 * Emits a JSON-LD block into the document.
 *
 * Deliberately not a client component: rendered on the server so the structured
 * data is present in the initial HTML, where crawlers read it without needing to
 * execute JavaScript.
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Escaping "<" prevents a stray "</script>" inside any string field from
      // terminating the tag early.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  )
}
