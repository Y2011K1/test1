import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { dummyCourses, getModuleCount } from "@/lib/courseData";
import MyCoursesClient from "./MyCoursesClient";

export const revalidate = 30;

export default async function MyCoursesPage() {
  const user = await currentUser();
  const metadata: any = user?.unsafeMetadata || {};
  const userPlan = metadata.plan || 'free';

  // Fetch all courses to filter them on the client
  const sanityCourses = await client.fetch(`*[_type == "course"] {
    _id, title, description, tier, thumbnail,
    "slug": slug.current,
    category-> { title },
    "moduleCount": count(modules[]),
    "lessonCount": count(modules[]->lessons[])
  }`);

  // Merge and dedup for full list
  const allRaw = [...sanityCourses, ...dummyCourses];
  const uniqueMap = new Map();
  const seenTitles = new Set();

  allRaw.forEach(c => {
    const slug = c.slug?.current || c._id;
    const normalizedTitle = (c.title || "").toLowerCase().trim();
    if (!uniqueMap.has(slug) && !seenTitles.has(normalizedTitle)) {
      uniqueMap.set(slug, { ...c, tier: c.tier || 'free' });
      seenTitles.add(normalizedTitle);
    }
  });

  const allCourses = Array.from(uniqueMap.values());

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-black mb-4 tracking-tighter">My Workspace</h1>
          <p className="text-gray-500">Pick up exactly where you left off. Your started courses and progress are saved here.</p>
        </div>

        <MyCoursesClient allCourses={allCourses} userPlan={userPlan} />
      </div>
    </div>
  );
}
