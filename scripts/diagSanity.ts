import { createClient } from "next-sanity";

const projectId = "hm5o0fjg";
const dataset = "production";

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-03-11",
  useCdn: false,
});

async function diagnostic() {
  console.log("🔍 Fetching courses from Sanity...");
  const courses = await client.fetch(`*[_type == "course"] { _id, title, "slug": slug.current }`);
  console.log("Total courses found:", courses.length);
  courses.forEach((c: any) => {
    console.log(`- [${c._id}] Title: "${c.title}" | Slug: "${c.slug}"`);
  });
}

diagnostic().catch(console.error);
