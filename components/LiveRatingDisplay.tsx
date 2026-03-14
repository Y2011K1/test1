"use client";
import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { getAverageRating } from "@/lib/ratingTracker";

/**
 * Client component that fetches and displays the live average
 * rating for a course from localStorage.
 * Falls back to defaultRating if no live ratings exist yet.
 */
export default function LiveRatingDisplay({ courseSlug, defaultRating }: { courseSlug: string; defaultRating?: number }) {
  const [avg, setAvg] = useState<{ average: number; count: number }>({ average: 0, count: 0 });

  useEffect(() => {
    setAvg(getAverageRating(courseSlug));
  }, [courseSlug]);

  const displayRating = avg.count > 0 ? avg.average : (defaultRating || 0);
  const displayLabel = avg.count > 0 ? `${avg.count} ${avg.count === 1 ? "rating" : "ratings"}` : "No ratings yet";

  if (displayRating === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <div className="flex text-yellow-400">
        <Star className="w-4 h-4 fill-current" />
      </div>
      <span className="text-sm font-bold text-gray-200">{displayRating.toFixed(2)}</span>
      <span className="text-gray-500 text-xs">{displayLabel}</span>
    </div>
  );
}
