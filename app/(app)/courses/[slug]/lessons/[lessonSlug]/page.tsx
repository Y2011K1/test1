import { client } from "@/sanity/lib/client";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, Clock, ChevronRight, Play } from "lucide-react";
import { getDummyCourseBySlug, formatDuration } from "@/lib/courseData";
import LessonRedesignedClient from "@/components/LessonRedesignedClient";
import LessonEnrollmentGuard from "@/components/LessonEnrollmentGuard";

export default async function LessonPage({ params }: { params: Promise<{ slug: string; lessonSlug: string }> }) {
  const user = await currentUser();
  const metadata: any = user?.unsafeMetadata || {};
  const userTier = metadata.plan || "free";
  const { slug, lessonSlug } = await params;

  // Fetch course with modules and lessons
  let course = await client.fetch(`*[_type == "course" && slug.current == $slug][0] {
    ...,
    category-> {title},
    modules[]-> {
      ...,
      lessons[]-> {
        ...,
        video {
          asset-> { playbackId }
        }
      }
    }
  }`, { slug });

  if (!course) {
    const dummy = getDummyCourseBySlug(slug);
    if (dummy) course = { ...dummy };
  }

  if (!course) return notFound();

  // Flatten lessons
  const allLessons: { lesson: any; module: any; moduleIdx: number; lessonIdx: number }[] = [];
  (course.modules || []).forEach((mod: any, mIdx: number) => {
    (mod.lessons || []).forEach((les: any, lIdx: number) => {
      allLessons.push({ lesson: les, module: mod, moduleIdx: mIdx, lessonIdx: lIdx });
    });
  });

  const currentIdx = allLessons.findIndex(l => l.lesson._id === lessonSlug);
  if (currentIdx === -1) return notFound();

  const current = allLessons[currentIdx];

  // RBAC Guard
  const isAuthorized = () => {
    if (userTier === "ultra") return true;
    if (userTier === "pro") return course.tier === "pro" || course.tier === "free";
    return course.tier === "free";
  };

  if (!isAuthorized()) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
        <div className="glassmorphism p-12 rounded-3xl border border-white/10 text-center max-w-xl">
          <BookOpen className="w-16 h-16 text-primary mx-auto mb-6 opacity-20" />
          <h1 className="text-3xl font-black mb-4">Plan Required</h1>
          <p className="text-gray-400 mb-8 italic">Upgrade to {course.tier.toUpperCase()} to unlock this session.</p>
          <Link href="/plans" className="bg-primary px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-neon-blue">
            Upgrade Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white animate-fade-in pb-32">
      {/* Top utility bar */}
      <div className="h-20 border-b border-white/5 flex items-center px-6 lg:px-12 justify-between sticky top-0 bg-background/80 backdrop-blur-xl z-50">
        <Link href={`/courses/${slug}`} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold truncate max-w-[250px]">{course.title}</span>
        </Link>
        <div className="hidden sm:flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-500">
           <span>{current.module.title}</span>
           <ChevronRight className="w-3 h-3" />
           <span className="text-primary">Lesson {current.lessonIdx + 1}</span>
        </div>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <LessonEnrollmentGuard courseSlug={slug} courseTitle={course.title}>
        <div className="max-w-6xl mx-auto px-4 lg:px-8 pt-12">
          {/* Lesson Header - Title above video */}
          <div className="mb-10 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
              <span className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black text-primary uppercase tracking-widest">
                Module {current.moduleIdx + 1}
              </span>
              <span className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                <Clock className="w-3 h-3" />
                {formatDuration(current.lesson.video?.asset?.data?.duration || current.lesson.duration)}
              </span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-black mb-4 tracking-tighter leading-tight">
              {current.lesson.title}
            </h1>
          </div>

          {/* Cinematic Video Player */}
          <div className="mb-12 relative group">
            {current.lesson.video?.asset?.playbackId || current.lesson.video?.playbackId ? (
              <div className="aspect-video rounded-3xl overflow-hidden bg-black border border-white/10 shadow-3xl shadow-primary/10 transition-all duration-700">
                <iframe
                  src={`https://player.mux.com/${current.lesson.video?.asset?.playbackId || current.lesson.video?.playbackId}`}
                  style={{ border: "none", width: "100%", height: "100%" }}
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="aspect-video rounded-3xl bg-white/5 border border-dashed border-white/10 flex flex-col items-center justify-center group-hover:bg-white/10 transition-all">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Play className="w-8 h-8 text-primary fill-current ml-1" />
                </div>
                <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Video Pending Upload</p>
              </div>
            )}
          </div>

          {/* Lesson Controls Section */}
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col gap-12">
              {/* Action Bar */}
              <div className="glassmorphism p-8 rounded-3xl border border-white/5 shadow-2xl">
                <LessonRedesignedClient 
                  courseSlug={slug}
                  courseTitle={course.title}
                  lessonId={current.lesson._id}
                  totalLessons={allLessons.length}
                />
              </div>

              {/* Content area */}
              <div className="prose prose-invert max-w-none prose-p:text-gray-400 prose-p:leading-loose prose-strong:text-white prose-headings:text-white">
                 <h3 className="text-2xl font-black mb-6">Learning Goals</h3>
                 <p>
                   Today we&apos;re diving into <strong className="text-primary">{current.lesson.title}</strong>. 
                   By the end of this session, you&apos;ll have a practical understanding of how to implement these 
                   concepts in a real-world environment.
                 </p>
                 <p>
                   Make sure to watch the full video and follow along with any provided exercises. 
                   If you encounter any issues, you can always revisit the course overview to see 
                   how this lesson fits into the broader module structure.
                 </p>
                 <div className="bg-primary/5 border border-white/5 p-6 rounded-2xl border-l-4 border-l-primary mt-8">
                    <p className="m-0 text-sm italic font-medium">
                      &quot;Complexity is your enemy. Any fool can make something complicated. 
                      It is hard to keep things simple.&quot; - EduNova Academy
                    </p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </LessonEnrollmentGuard>
    </div>
  );
}
