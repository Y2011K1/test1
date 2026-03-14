"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, CheckCircle, Circle, BookOpen } from "lucide-react";
import { getCompletedLessons, toggleLessonComplete } from "@/lib/progressTracker";

interface LessonNav {
  id: string;
  title: string;
}

interface LessonClientSectionProps {
  courseSlug: string;
  lessonId: string;
  totalLessons: number;
  prevLesson: LessonNav | null;
  nextLesson: LessonNav | null;
}

export default function LessonClientSection({ courseSlug, lessonId, totalLessons, prevLesson, nextLesson }: LessonClientSectionProps) {
  const router = useRouter();
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const isComplete = completedIds.includes(lessonId);

  useEffect(() => {
    setCompletedIds(getCompletedLessons(courseSlug));
  }, [courseSlug, lessonId]);

  const handleToggle = () => {
    const updated = toggleLessonComplete(courseSlug, lessonId);
    setCompletedIds([...updated]);
  };

  const progressPercent = Math.round((completedIds.length / totalLessons) * 100);

  return (
    <div className="space-y-8">
      {/* Live Progress Card */}
      <div className="glassmorphism rounded-2xl border border-white/5 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Course Progress</h4>
            <p className="text-2xl font-black text-white">
              {completedIds.length} <span className="text-gray-500 text-sm font-normal">/ {totalLessons} Lessons Finished</span>
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black text-primary">{progressPercent}%</span>
          </div>
        </div>
        
        {/* Live Progress Bar */}
        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
          <div 
            className="h-full bg-gradient-to-r from-primary to-cyberPurple transition-all duration-700 ease-out shadow-neon-blue"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="mt-6 pt-6 border-t border-white/5 flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleToggle}
            className={`flex-1 py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 active:scale-95 ${
              isComplete
                ? "bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20"
                : "bg-primary text-white shadow-neon-blue hover:bg-blue-600 border border-primary/50"
            }`}
          >
            {isComplete ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Lesson Completed
              </>
            ) : (
              <>
                <Circle className="w-5 h-5" />
                Mark as Complete
              </>
            )}
          </button>

          <Link
            href={`/courses/${courseSlug}`}
            className="flex-1 py-4 rounded-xl font-bold text-sm uppercase tracking-widest bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            <BookOpen className="w-5 h-4" />
            View Course Overview
          </Link>
        </div>
      </div>

      {/* Prev / Next navigation */}
      <div className="flex items-stretch gap-4">
        {prevLesson ? (
          <Link
            href={`/courses/${courseSlug}/lessons/${prevLesson.id}`}
            className="flex-1 glassmorphism p-4 rounded-xl border border-white/5 hover:border-primary/20 transition-all group flex items-center gap-3"
          >
            <ChevronLeft className="w-5 h-5 text-gray-500 group-hover:text-primary transition-colors shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">Previous</p>
              <p className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors truncate">{prevLesson.title}</p>
            </div>
          </Link>
        ) : (
          <div className="flex-1" />
        )}

        {nextLesson ? (
          <Link
            href={`/courses/${courseSlug}/lessons/${nextLesson.id}`}
            className="flex-1 glassmorphism p-4 rounded-xl border border-white/5 hover:border-primary/20 transition-all group flex items-center justify-end gap-3 text-right"
          >
            <div className="min-w-0">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">Next</p>
              <p className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors truncate">{nextLesson.title}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-primary transition-colors shrink-0" />
          </Link>
        ) : (
          <Link
            href={`/courses/${courseSlug}`}
            className="flex-1 glassmorphism p-4 rounded-xl border border-green-500/20 bg-green-500/5 hover:bg-green-500/10 transition-all group flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm font-bold text-green-400">Back to Course Overview</span>
          </Link>
        )}
      </div>
    </div>
  );
}
