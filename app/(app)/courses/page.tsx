"use client";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { Search, Filter, BookOpen, Users, Clock } from "lucide-react";
import { dummyCourses, getModuleCount, getLessonCount, getTotalDuration } from "@/lib/courseData";
import { getAllEnrollmentCounts } from "@/lib/enrollmentTracker";
import { getAllProgress } from "@/lib/progressTracker";
import LiveRatingDisplay from "@/components/LiveRatingDisplay";
import { CourseGridSkeleton } from "@/components/Skeletons";

export default function CoursesPage() {
  const { user, isLoaded } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState<Record<string, number>>({});
  const [progress, setProgress] = useState<Record<string, string[]>>({});

  const metadata: any = user?.unsafeMetadata || {};
  const userPlan = metadata.plan || 'free';

  useEffect(() => {
    // Load live enrollment counts and progress from localStorage
    setEnrollments(getAllEnrollmentCounts());
    setProgress(getAllProgress());

    async function fetchCourses() {
      const sanityCourses = await client.fetch(`*[_type == "course"] | order(_createdAt desc) {
        _id, title, description, tier, thumbnail,
        "slug": slug.current,
        category-> { title },
        "moduleCount": count(modules[]),
        "lessonCount": count(modules[]->lessons[]),
        modules[]-> {
          _id, title,
          lessons[]-> {
            _id, title,
            video { asset-> { data { duration } } }
          }
        }
      }`);

      // Merge Sanity courses with shared dummy courses, deduplicating by slug AND title
      const all = [...sanityCourses, ...dummyCourses];
      const uniqueMap = new Map();
      const seenTitles = new Set();

      all.forEach(c => {
        const slug = c.slug?.current || c._id;
        const normalizedTitle = (c.title || "").toLowerCase().trim();

        if (!uniqueMap.has(slug) && !seenTitles.has(normalizedTitle)) {
          uniqueMap.set(slug, { ...c, tier: c.tier || 'free' });
          seenTitles.add(normalizedTitle);
        }
      });
      setCourses(Array.from(uniqueMap.values()));
      setLoading(false);
    }
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());

    const categoryTitle = typeof course.category === 'string' ? course.category : course.category?.title;
    const matchesCategory = selectedCategory === "All" || categoryTitle === selectedCategory;

    let hasAccess = false;
    if (userPlan === 'ultra') hasAccess = true;
    else if (userPlan === 'pro') hasAccess = course.tier === 'pro' || course.tier === 'free';
    else hasAccess = course.tier === 'free';

    return matchesSearch && matchesCategory && hasAccess;
  });

  const categories = ["All", "Development", "Design", "DevOps", "Data Science", "Cloud"];

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-background text-white">
        <main className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CourseGridSkeleton count={6} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary/30 animate-fade-in">
      <main className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl lg:text-6xl font-extrabold mb-4 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                Course Catalog
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl">
                Master new skills with our premium curriculum. Accessing content for the <span className="text-primary font-bold uppercase">{userPlan}</span> tier.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <Users className="w-4 h-4" />
              <span>{courses.length} Courses available</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between glassmorphism p-4 rounded-custom border border-white/5">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search courses, skills, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 no-scrollbar">
              <Filter className="w-4 h-4 text-gray-500 mr-2 shrink-0" />
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat
                    ? "bg-primary text-white shadow-neon-blue"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </header>

        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course: any) => {
              const moduleCount = getModuleCount(course);
              const lessonCount = getLessonCount(course);
              const slug = course.slug?.current || course._id;
              const enrolled = enrollments[slug] || 0;
              const completedLessons = progress[slug] || [];
              const progressPercent = lessonCount > 0 ? Math.round((completedLessons.length / lessonCount) * 100) : 0;

              return (
              <div key={course._id} className="glassmorphism rounded-custom overflow-hidden group border border-white/5 flex flex-col hover:border-primary/20 transition-all shadow-xl hover:-translate-y-1 duration-300">
                <div className="h-52 overflow-hidden relative shrink-0">
                  <img
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    src={course.thumbnail ? urlFor(course.thumbnail).url() : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"}
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                      <div className={`text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                          course.tier === 'ultra' ? 'bg-cyberPurple shadow-neon-purple' :
                          course.tier === 'pro' ? 'bg-primary shadow-neon-blue' :
                          'bg-green-500 shadow-neon-green'
                      }`}>
                          {course.tier}
                      </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <div className="flex items-center gap-4 text-xs font-medium text-white">
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-primary" />
                        <span>{moduleCount} {moduleCount === 1 ? "Module" : "Modules"}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{getTotalDuration(course)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest px-2 py-0.5 border border-primary/30 rounded bg-primary/5">
                      {typeof course.category === 'string' ? course.category : (course.category?.title || "General")}
                    </span>
                    {progressPercent > 0 && (
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                        progressPercent === 100 ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-primary/10 text-primary border border-primary/30'
                      }`}>
                        {progressPercent}% done
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-4 line-clamp-2 leading-tight group-hover:text-primary transition-colors">{course.title}</h3>
                  {/* description hidden in preview as per request */}

                  <div className="mt-auto space-y-6">
                    <div className="flex items-center justify-between">
                      <LiveRatingDisplay courseSlug={slug} defaultRating={course.rating} />
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {course.tier === 'free' ? 'Standard Access' : course.tier === 'pro' ? 'Pro Content' : 'Exclusive'}
                      </span>
                    </div>

                    <Link
                      href={`/courses/${slug}`}
                      className="flex items-center justify-center gap-2 w-full bg-primary py-3 rounded-xl text-sm font-bold hover:bg-blue-600 transition-all shadow-neon-blue active:scale-95"
                    >
                      View Course Details
                    </Link>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 glassmorphism rounded-custom border border-white/5">
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No courses found</h3>
            <p className="text-gray-400">Try adjusting your search or filters to find what you're looking for.</p>
            <button
              onClick={() => {setSearchQuery(""); setSelectedCategory("All");}}
              className="mt-6 text-primary font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
