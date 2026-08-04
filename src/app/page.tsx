import HomeContent from "./HomeContent";
import JsonLd from "@/components/seo/JsonLd";
import { graph, profilePageSchema } from "@/lib/seo/schema";

// Server component by design: the JSON-LD below is emitted into the initial HTML
// where crawlers read it without executing JavaScript. All interactivity lives
// in <HomeContent />, which is the client boundary.
export default function Home() {
  return (
    <>
      {/* ProfilePage is Google's recommended type for a page about one person.
          It references the Person defined in the root layout by @id, so the two
          scripts read as a single connected graph. */}
      <JsonLd data={graph(profilePageSchema())} />
      <HomeContent />
    </>
  );
}
