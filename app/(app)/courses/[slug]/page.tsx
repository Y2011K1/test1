import { client } from "@/sanity/lib/client";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, Clock, BookOpen, Users, CheckCircle, ShieldCheck, ArrowLeft, Lock, Rocket, Zap, Crown } from "lucide-react";
import CurriculumAccordion from "@/components/CurriculumAccordion";
import { getDummyCourseBySlug, getModuleCount, getLessonCount, getTotalDuration } from "@/lib/courseData";
import LiveRatingDisplay from "@/components/LiveRatingDisplay";
import CourseRatingWidget from "@/components/CourseRatingWidget";
import CourseProgressCard from "@/components/CourseProgressCard";

export const revalidate = 60; // Cache page for 60 seconds (ISR)

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const user = await currentUser();
  const metadata: any = user?.unsafeMetadata || {};
  const userTier = metadata.plan || 'free';
  const { slug } = await params;

  // 1. Try fetching from Sanity
  let course = await client.fetch(`*[_type == "course" && slug.current == $slug][0] {
    ...,
    category-> {title},
    modules[]-> {
      ...,
      lessons[]-> {
        ...,
        video {
          asset-> { 
            playbackId,
            data { duration }
          }
        }
      }
    }
  }`, { slug });

  // 2. Fallback to shared dummy data
  if (!course) {
    const dummy = getDummyCourseBySlug(slug);
    if (dummy) course = { ...dummy };
  }

  if (!course) return notFound();

  const moduleCount = getModuleCount(course);
  const lessonCount = getLessonCount(course);
  const totalDuration = getTotalDuration(course);

  const isAuthorized = () => {
    if (userTier === 'ultra') return true;
    if (userTier === 'pro') return course.tier === 'pro' || course.tier === 'free';
    return course.tier === 'free';
  };

  const authorized = isAuthorized();

  return (
    <div className="min-h-screen bg-background text-white animate-fade-in selection:bg-primary/30">
      {/* Premium Hero Section */}
      <section className="relative pt-32 pb-20 border-b border-white/10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary/10 to-transparent blur-3xl rounded-full opacity-50 -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <Link href="/courses" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 group">
             <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
             <span className="text-sm font-medium">Back to Gallery</span>
           </Link>

           <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
             <div className="lg:col-span-8">
                <div className="flex items-center gap-3 mb-6">
                   <div className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${
                      course.tier === 'ultra' ? 'bg-cyberPurple shadow-neon-purple' :
                      course.tier === 'pro' ? 'bg-primary shadow-neon-blue' :
                      'bg-green-500 shadow-neon-green'
                   }`}>
                      {course.tier} Access
                   </div>
                   <span className="text-xs font-bold text-gray-500 tracking-widest uppercase px-3 py-1.5 border border-white/10 rounded-full bg-white/5">
                      {typeof course.category === 'string' ? course.category : (course.category?.title || "Technology")}
                   </span>
                </div>

                <h1 className="text-4xl lg:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
                  {course.title}
                </h1>

                <p className="text-gray-400 text-xl leading-relaxed mb-8 max-w-3xl">
                   {course.description}
                </p>

                <div className="flex flex-wrap items-center gap-8 text-sm font-bold text-gray-300">
                  <LiveRatingDisplay courseSlug={slug} defaultRating={course.rating} />
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <span>{totalDuration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <span>{moduleCount} {moduleCount === 1 ? "Module" : "Modules"} · {lessonCount} {lessonCount === 1 ? "Lesson" : "Lessons"}</span>
                  </div>
                </div>
             </div>

             <div className="lg:col-span-4 sticky top-32">
                <div className="glassmorphism p-8 rounded-custom border border-white/10 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    {course.tier === 'ultra' ? <Crown className="w-24 h-24" /> : <Rocket className="w-24 h-24" />}
                  </div>

                  <h3 className="text-2xl font-bold mb-6">Course Overview</h3>

                  <div className="space-y-5 mb-8">
                     <div className="flex items-center gap-4 text-gray-300">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        <span className="text-sm">Full Lifetime Access</span>
                     </div>
                     <div className="flex items-center gap-4 text-gray-300">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        <span className="text-sm">Access on all devices</span>
                     </div>
                     <div className="flex items-center gap-4 text-gray-300">
                        <ShieldCheck className="w-5 h-5 text-primary" />
                        <span className="text-sm">Verified Premium Content</span>
                     </div>
                  </div>

                  <CourseProgressCard 
                    courseSlug={slug}
                    totalLessons={lessonCount}
                    courseTier={course.tier}
                    authorized={authorized}
                  />
                </div>
             </div>
           </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold flex items-center gap-4">
                <BookOpen className="w-8 h-8 text-primary" />
                Course Curriculum
              </h2>
              <div className="text-sm font-medium text-gray-500">
                {moduleCount} {moduleCount === 1 ? "Module" : "Modules"} · {lessonCount} {lessonCount === 1 ? "Lesson" : "Lessons"}
              </div>
            </div>

            <CurriculumAccordion
              modules={course.modules || []}
              courseTier={course.tier}
              userTier={userTier}
              courseSlug={slug}
            />

            {!authorized && (
              <div className="mt-12 glassmorphism p-12 rounded-custom border border-dashed border-white/10 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full"></div>
                <div className="relative z-10">
                  <Lock className="w-16 h-16 text-primary mx-auto mb-6 opacity-30" />
                  <h3 className="text-2xl font-bold mb-4 italic text-gray-400">Expand your horizon?</h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto">This course features advanced modules exclusive to our {course.tier.toUpperCase()} members.</p>
                  <Link href="/plans" className="text-primary font-bold hover:underline flex items-center justify-center gap-2">
                    See what else you&apos;re missing in {course.tier} <Zap className="w-4 h-4 fill-current" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-12">
            <div>
               <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 px-4">About the Instructor</h4>
               <div className="glassmorphism p-6 rounded-custom border border-white/5 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-cyberPurple p-0.5">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                       <Users className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h5 className="font-bold">{course.instructor || "EduNova Instructor"}</h5>
                    <p className="text-xs text-gray-500">Senior Course Author</p>
                  </div>
               </div>
            </div>

            <div className="glassmorphism p-6 rounded-custom border border-white/5">
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">Learning Outcomes</h4>
                <ul className="space-y-4">
                  {[
                    "Architect complex applications",
                    "Optimize rendering performance",
                    "Master modern patterns",
                    "Understand low-level internals"
                  ].map((outcome, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                      <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      </div>
                      {outcome}
                    </li>
                  ))}
                </ul>
            </div>

            {/* Course Rating */}
            <CourseRatingWidget courseSlug={slug} course={course} />
          </div>
        </div>
      </section>
    </div>
  );
}
