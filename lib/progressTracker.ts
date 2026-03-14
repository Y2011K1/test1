/**
 * Progress tracker — stores which lessons and modules a user
 * has completed per course, using localStorage.
 */

const STORAGE_KEY = "edunova_progress";

interface CourseProgress {
  completedLessons: string[]; // lesson _ids
}

type ProgressData = Record<string, CourseProgress>; // keyed by course slug

function getProgressData(): ProgressData {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgressData(data: ProgressData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/** Toggle a lesson's completion status. Returns the updated set. */
export function toggleLessonComplete(courseSlug: string, lessonId: string): string[] {
  const data = getProgressData();
  if (!data[courseSlug]) {
    data[courseSlug] = { completedLessons: [] };
  }

  const idx = data[courseSlug].completedLessons.indexOf(lessonId);
  if (idx === -1) {
    data[courseSlug].completedLessons.push(lessonId);
  } else {
    data[courseSlug].completedLessons.splice(idx, 1);
  }

  saveProgressData(data);
  return data[courseSlug].completedLessons;
}

/** Get all completed lesson IDs for a course */
export function getCompletedLessons(courseSlug: string): string[] {
  const data = getProgressData();
  return data[courseSlug]?.completedLessons || [];
}

/** Get progress for all courses at once */
export function getAllProgress(): Record<string, string[]> {
  const data = getProgressData();
  const result: Record<string, string[]> = {};
  for (const [slug, progress] of Object.entries(data)) {
    result[slug] = progress.completedLessons;
  }
  return result;
}
/** Check if a course is fully completed (all lessons marked) */
export function isCourseCompleted(courseSlug: string, totalLessons: number): boolean {
  if (totalLessons === 0) return false;
  const completed = getCompletedLessons(courseSlug);
  return completed.length >= totalLessons;
}
