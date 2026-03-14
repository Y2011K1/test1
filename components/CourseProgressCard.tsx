"use client";
import { useState, useEffect } from "react";
import { CheckCircle, Zap, BookOpen } from "lucide-react";
import { getCompletedLessons } from "@/lib/progressTracker";
import { isStarted, startCourse, getEnrollmentCount } from "@/lib/enrollmentTracker";
import Link from "next/link";

interface CourseProgressCardProps {
  courseSlug: string;
  totalLessons: number;
  courseTier: string;
  authorized: boolean;
}

export default function CourseProgressCard({ courseSlug, totalLessons, courseTier, authorized }: CourseProgressCardProps) {
  const [completedCount, setCompletedCount] = useState(0);
  const [enrolled, setEnrolled] = useState(false);
  const [liveStudents, setLiveStudents] = useState(0);

  useEffect(() => {
    setCompletedCount(getCompletedLessons(courseSlug).length);
    setEnrolled(isStarted(courseSlug));
    setLiveStudents(getEnrollmentCount(courseSlug));
  }, [courseSlug]);

  const handleStart = () => {
    startCourse(courseSlug);
    setEnrolled(true);
    setLiveStudents(prev => prev + 1);
  };

  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  if (!authorized) {
    return (
      <div className="space-y-4">
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-4">
          <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
             <CheckCircle className="w-4 h-4 text-red-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-red-400 uppercase tracking-tighter">Content Locked</p>
            <p className="text-xs text-red-500/70 leading-relaxed">This {courseTier} course requires a higher tier plan.</p>
          </div>
        </div>
        <Link
          href="/plans"
          className="w-full bg-primary py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-neon-blue flex items-center justify-center gap-2 active:scale-95"
        >
          Upgrade Account
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Live Student Counter */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/5 rounded-xl border border-white/5">
         <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Enrolled Students</span>
         <span className="text-sm font-black text-primary animate-pulse">{liveStudents} Live</span>
      </div>

      {enrolled ? (
        <div className="space-y-6">
          <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Your Progress</span>
              <span className="text-xs font-black text-white">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
               <div 
                 className="h-full bg-primary transition-all duration-1000" 
                 style={{ width: `${progressPercent}%` }}
               />
            </div>
            <p className="mt-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">
              {completedCount} / {totalLessons} Lessons Completed
            </p>
          </div>
          
          <button 
            onClick={() => window.location.href = `/courses/${courseSlug}/lessons`}
            className="w-full bg-primary py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-neon-blue active:scale-95 flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 fill-current" />
            Continue Learning
          </button>
        </div>
      ) : (
        <button 
          onClick={handleStart}
          className="w-full bg-white text-black py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <BookOpen className="w-4 h-4" />
          Start Course Now
        </button>
      )}
    </div>
  );
}
