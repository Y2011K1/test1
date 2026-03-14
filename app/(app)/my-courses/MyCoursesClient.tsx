"use client";
import { useState, useEffect } from "react";
import { getStartedCourses } from "@/lib/enrollmentTracker";
import { getCompletedLessons } from "@/lib/progressTracker";
import { getLessonCount } from "@/lib/courseData";
import Link from "next/link";
import { Play, BookOpen, Clock, Zap } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";

export default function MyCoursesClient({ allCourses, userPlan }: { allCourses: any[], userPlan: string }) {
  const [startedSlugs, setStartedSlugs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setStartedSlugs(getStartedCourses());
    setLoading(false);
  }, []);

  const enrolledCourses = allCourses.filter(course => {
    const slug = course.slug?.current || course._id;
    return startedSlugs.includes(slug);
  });

  if (loading) {
    return <div className="animate-pulse space-y-8">
      {[1, 2, 3].map(i => <div key={i} className="h-48 bg-white/5 rounded-3xl border border-white/5" />)}
    </div>;
  }

  if (enrolledCourses.length === 0) {
    return (
      <div className="glassmorphism p-16 rounded-3xl border border-dashed border-white/10 text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
           <BookOpen className="w-10 h-10 text-primary opacity-20" />
        </div>
        <h3 className="text-2xl font-black mb-4 italic text-gray-400">Your workspace is empty.</h3>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto">Explore our collection and start your first course to see it here.</p>
        <Link href="/courses" className="bg-primary px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-neon-blue inline-flex items-center gap-2">
          Browse Courses <Zap className="w-4 h-4 fill-current" />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {enrolledCourses.map((course: any) => {
        const slug = course.slug?.current || course._id;
        const total = getLessonCount(course);
        const completed = getCompletedLessons(slug).length;
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

        return (
          <div key={slug} className="glassmorphism rounded-3xl overflow-hidden border border-white/5 flex flex-col group hover:border-primary/30 transition-all duration-500 shadow-xl">
            <div className="h-48 relative overflow-hidden">
               <img 
                 src={course.thumbnail ? urlFor(course.thumbnail).url() : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"}
                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                 alt={course.title}
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
               <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between mb-2">
                     <span className="text-[10px] font-black uppercase tracking-widest text-primary">{progress}% Complete</span>
                     <span className="text-[10px] font-medium text-gray-400">{completed} / {total} Lessons</span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                     <div 
                       className="h-full bg-primary transition-all duration-1000" 
                       style={{ width: `${progress}%` }}
                     />
                  </div>
               </div>
            </div>
            
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-lg font-black mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
              <p className="text-xs text-gray-500 mb-6 line-clamp-2 leading-relaxed">{course.description}</p>
              
              <div className="mt-auto pt-6 border-t border-white/5">
                 <Link 
                   href={`/courses/${slug}`}
                   className="w-full py-4 rounded-xl bg-primary text-white font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-neon-blue"
                 >
                   <Play className="w-3 h-3 fill-current" />
                   Continue Learning
                 </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
