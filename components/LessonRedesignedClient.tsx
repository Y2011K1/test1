"use client";
import { useState, useEffect } from "react";
import { CheckCircle, Circle, ArrowLeft } from "lucide-react";
import { toggleLessonComplete, getCompletedLessons, isCourseCompleted } from "@/lib/progressTracker";
import RatingPopup from "./RatingPopup";

interface LessonRedesignedClientProps {
  courseSlug: string;
  courseTitle: string;
  lessonId: string;
  totalLessons: number;
}

export default function LessonRedesignedClient({ courseSlug, courseTitle, lessonId, totalLessons }: LessonRedesignedClientProps) {
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [showRating, setShowRating] = useState(false);
  const [hasRatedBefore, setHasRatedBefore] = useState(false);

  useEffect(() => {
    const completed = getCompletedLessons(courseSlug);
    setCompletedIds(completed);
    
    // Check if user has already rated (localStorage)
    const raw = localStorage.getItem(`rated_${courseSlug}`);
    if (raw) setHasRatedBefore(true);
  }, [courseSlug]);

  const handleToggle = () => {
    const updated = toggleLessonComplete(courseSlug, lessonId);
    setCompletedIds([...updated]);

    // Show rating popup if course is finished and user hasn't rated yet
    if (updated.length >= totalLessons && !hasRatedBefore) {
      setShowRating(true);
      localStorage.setItem(`rated_${courseSlug}`, "true");
    }
  };

  const isComplete = completedIds.includes(lessonId);

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <button
          onClick={handleToggle}
          className={`group flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all active:scale-95 border ${
            isComplete
              ? "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20"
              : "bg-white text-black hover:bg-gray-200 border-white"
          }`}
        >
          {isComplete ? (
            <>
              <CheckCircle className="w-5 h-5 fill-current" />
              Lesson Finished
            </>
          ) : (
            <>
              <Circle className="w-5 h-5" />
              Mark as Complete
            </>
          )}
        </button>

        <a 
          href={`/courses/${courseSlug}`}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm font-bold group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Course Overview
        </a>
      </div>

      {showRating && (
        <RatingPopup 
          courseSlug={courseSlug} 
          courseTitle={courseTitle} 
          onClose={() => setShowRating(false)} 
        />
      )}
    </>
  );
}
