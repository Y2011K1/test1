/**
 * Live course rating system using localStorage.
 * Stores individual user ratings and computes live averages.
 * Users can only rate after completing at least one lesson.
 */

const STORAGE_KEY = "edunova_ratings";

interface CourseRating {
  visitorId: string;
  rating: number; // 1-5
  timestamp: number;
}

type RatingData = Record<string, CourseRating[]>; // keyed by course slug

function getRatingData(): RatingData {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveRatingData(data: RatingData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("edunova_visitor_id");
  if (!id) {
    id = `v_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem("edunova_visitor_id", id);
  }
  return id;
}

/** Submit or update a rating for a course */
export function submitRating(courseSlug: string, rating: number): void {
  const data = getRatingData();
  const visitorId = getVisitorId();

  if (!data[courseSlug]) {
    data[courseSlug] = [];
  }

  // Update existing or add new
  const existingIdx = data[courseSlug].findIndex(r => r.visitorId === visitorId);
  const entry: CourseRating = { visitorId, rating, timestamp: Date.now() };

  if (existingIdx !== -1) {
    data[courseSlug][existingIdx] = entry;
  } else {
    data[courseSlug].push(entry);
  }

  saveRatingData(data);
}

/** Get the current user's rating for a course (or null) */
export function getMyRating(courseSlug: string): number | null {
  const data = getRatingData();
  const visitorId = getVisitorId();
  const entry = data[courseSlug]?.find(r => r.visitorId === visitorId);
  return entry?.rating ?? null;
}

/** Compute live average rating for a course */
export function getAverageRating(courseSlug: string): { average: number; count: number } {
  const data = getRatingData();
  const ratings = data[courseSlug] || [];

  if (ratings.length === 0) return { average: 0, count: 0 };

  const sum = ratings.reduce((s, r) => s + r.rating, 0);
  return {
    average: Math.round((sum / ratings.length) * 100) / 100,
    count: ratings.length
  };
}

/** Get live ratings for all courses at once */
export function getAllAverageRatings(): Record<string, { average: number; count: number }> {
  const data = getRatingData();
  const result: Record<string, { average: number; count: number }> = {};

  for (const [slug, ratings] of Object.entries(data)) {
    if (ratings.length === 0) continue;
    const sum = ratings.reduce((s, r) => s + r.rating, 0);
    result[slug] = {
      average: Math.round((sum / ratings.length) * 100) / 100,
      count: ratings.length
    };
  }

  return result;
}
