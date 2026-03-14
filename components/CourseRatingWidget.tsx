"use client";
import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { getMyRating, submitRating, getAverageRating } from "@/lib/ratingTracker";
import { getCompletedLessons } from "@/lib/progressTracker";
import { getLessonCount } from "@/lib/courseData";

interface CourseRatingProps {
  courseSlug: string;
  course: any;
}

export default function CourseRatingWidget({ courseSlug, course }: CourseRatingProps) {
  const [myRating, setMyRating] = useState<number | null>(null);
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [avgData, setAvgData] = useState<{ average: number; count: number }>({ average: 0, count: 0 });
  const [hasProgress, setHasProgress] = useState(false);
  const [justRated, setJustRated] = useState(false);

  useEffect(() => {
    setMyRating(getMyRating(courseSlug));
    setAvgData(getAverageRating(courseSlug));
    const completed = getCompletedLessons(courseSlug);
    setHasProgress(completed.length > 0);
  }, [courseSlug]);

  const handleRate = (stars: number) => {
    submitRating(courseSlug, stars);
    setMyRating(stars);
    setAvgData(getAverageRating(courseSlug));
    setJustRated(true);
    setTimeout(() => setJustRated(false), 2000);
  };

  if (!hasProgress) return null; // Only show to users who have started the course

  return (
    <div className="glassmorphism rounded-xl border border-white/5 p-6 space-y-4">
      <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Rate This Course</h4>

      {/* Star picker */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            onClick={() => handleRate(star)}
            className="transition-transform hover:scale-125 active:scale-95"
          >
            <Star className={`w-7 h-7 transition-colors ${
              star <= (hoveredStar || myRating || 0)
                ? 'text-yellow-400 fill-current'
                : 'text-white/10'
            }`} />
          </button>
        ))}
        {myRating && (
          <span className="ml-3 text-sm text-gray-400">
            Your rating: <strong className="text-yellow-400">{myRating}/5</strong>
          </span>
        )}
      </div>

      {justRated && (
        <p className="text-xs text-green-400 animate-pulse">Thanks for your rating!</p>
      )}

      {/* Live average */}
      {avgData.count > 0 && (
        <div className="flex items-center gap-3 pt-2 border-t border-white/5">
          <div className="flex text-yellow-400">
            <Star className="w-4 h-4 fill-current" />
          </div>
          <span className="text-sm font-bold text-gray-200">{avgData.average}</span>
          <span className="text-xs text-gray-500">from {avgData.count} {avgData.count === 1 ? "rating" : "ratings"}</span>
        </div>
      )}
    </div>
  );
}
