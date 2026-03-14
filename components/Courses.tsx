import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { dummyCourses, getModuleCount } from "@/lib/courseData";

export default async function Courses() {
  const user = await currentUser();
  const metadata: any = user?.unsafeMetadata || {};
  const userPlan = metadata.plan || 'free';

  // Fetch real courses from Sanity — only required fields for homepage preview
  const sanityCourses = await client.fetch(`*[_type == "course"] | order(_createdAt desc) {
    _id, title, description, tier, thumbnail,
    "slug": slug.current,
    category-> { title },
    "moduleCount": count(modules[]),
    "lessonCount": count(modules[]->lessons[])
  }`, {}, { next: { revalidate: 60 } });

  // Deduping by slug AND title, prioritizing Sanity
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

  // RBAC Filtering
  const visibleCourses = allCourses.filter(course => {
    if (userPlan === 'ultra') return true;
    if (userPlan === 'pro') return course.tier === 'pro' || course.tier === 'free';
    return course.tier === 'free';
  });

  return (
    <section className="py-24 bg-white/[0.02]" id="courses">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">Unlocking Premium Knowledge</h2>
            <p className="text-gray-400">
                {userPlan === 'free' ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    You are currently using the <strong className="text-white">Free Plan</strong>.
                  </span>
                ) : (
                  <>Showing <strong className="text-white capitalize">{userPlan}</strong> tier courses.</>
                )}
                {userPlan !== 'ultra' && " Upgrade your plan to unlock more elite content."}
            </p>
          </div>
          <Link href="/courses" className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all">
            View Expanded Gallery
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path clipRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" fillRule="evenodd"></path></svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleCourses.slice(0, 3).map((course: any) => {
            const moduleCount = getModuleCount(course);

            return (
            <div key={course._id} className="glassmorphism rounded-custom overflow-hidden group border border-white/5 flex flex-col hover:border-primary/20 transition-all">
              <div className="h-48 overflow-hidden relative shrink-0">
                <img
                  alt={course.title || "Course Thumbnail"}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src={course.thumbnail ? urlFor(course.thumbnail).url() : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"}
                />
                <div className="absolute top-4 right-4 flex gap-2">
                    <div className={`text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest ${
                        course.tier === 'ultra' ? 'bg-cyberPurple shadow-neon-purple' :
                        course.tier === 'pro' ? 'bg-primary shadow-neon-blue' :
                        'bg-green-500 shadow-neon-green'
                    }`}>
                        {course.tier}
                    </div>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-bold mb-2 line-clamp-2" title={course.title}>{course.title || "Untitled Course"}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2" title={course.description}>{course.description || "By EduNova Instructor"}</p>

                <div className="mt-auto">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex text-yellow-500">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    </div>
                    <span className="text-sm font-bold">{course.rating ? course.rating : "—"}</span>
                    <span className="text-gray-500 text-xs">·</span>
                    <span className="text-gray-500 text-xs">{moduleCount} {moduleCount === 1 ? "module" : "modules"}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="text-xl font-bold">
                      {course.tier === 'free' ? 'Included' : course.tier === 'pro' ? 'Pro Access' : 'Ultra Exclusive'}
                    </span>
                    <Link
                    href={`/courses/${course.slug?.current || course._id}`}
                    className="bg-primary/20 text-primary hover:bg-primary hover:text-white px-4 py-2 rounded-custom text-sm font-bold transition-all shadow-neon-blue inline-flex items-center justify-center min-w-[120px]"
                    role="button"
                  >
                    View Details
                  </Link>
                  </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
