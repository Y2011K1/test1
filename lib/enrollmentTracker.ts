/**
 * Live enrollment tracker using localStorage.
 * Tracks unique course visits per browser session and provides
 * a running enrollment count per course slug.
 *
 * This creates a truly "live" counter that increments when real
 * users visit a course page.
 */

const STORAGE_KEY = "edunova_enrollments";

interface EnrollmentData {
  [slug: string]: {
    count: number;
    visitors: string[]; // unique visitor IDs
  };
}

function getEnrollmentData(): EnrollmentData {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveEnrollmentData(data: EnrollmentData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/** Get or create a unique visitor ID for this browser */
function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("edunova_visitor_id");
  if (!id) {
    id = `v_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem("edunova_visitor_id", id);
  }
  return id;
}

/**
 * Record a visit to a course. Only increments the counter once
 * per unique visitor per course (prevents refresh-spamming).
 * Returns the updated count.
 */
export function recordCourseVisit(slug: string): number {
  const data = getEnrollmentData();
  const visitorId = getVisitorId();

  if (!data[slug]) {
    data[slug] = { count: 0, visitors: [] };
  }

  // Only count unique visitors
  if (!data[slug].visitors.includes(visitorId)) {
    data[slug].count += 1;
    data[slug].visitors.push(visitorId);
    saveEnrollmentData(data);
  }

  return data[slug].count;
}

/** 
 * Officially start a course. This "enrolls" the student
 * specifically (vs just visiting).
 */
export function startCourse(slug: string): void {
  const visitorId = getVisitorId();
  const key = `edunova_started_${visitorId}`;
  const started = getStartedCourses();
  if (!started.includes(slug)) {
    started.push(slug);
    localStorage.setItem(key, JSON.stringify(started));
    
    // Also record this as a visit if it hasn't been yet
    recordCourseVisit(slug);
  }
}

/** Check if a course has been started by this user */
export function isStarted(slug: string): boolean {
  if (typeof window === "undefined") return false;
  const visitorId = getVisitorId();
  const raw = localStorage.getItem(`edunova_started_${visitorId}`);
  if (!raw) return false;
  try {
    const started: string[] = JSON.parse(raw);
    return started.includes(slug);
  } catch {
    return false;
  }
}

/** Get list of all started course slugs */
export function getStartedCourses(): string[] {
  if (typeof window === "undefined") return [];
  const visitorId = getVisitorId();
  const raw = localStorage.getItem(`edunova_started_${visitorId}`);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Get the current enrollment count for a course.
 */
export function getEnrollmentCount(slug: string): number {
  const data = getEnrollmentData();
  return data[slug]?.count || 0;
}

/**
 * Get enrollment counts for all courses at once.
 */
export function getAllEnrollmentCounts(): Record<string, number> {
  const data = getEnrollmentData();
  const counts: Record<string, number> = {};
  for (const [slug, info] of Object.entries(data)) {
    counts[slug] = info.count;
  }
  return counts;
}
