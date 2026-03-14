"use client";
import { useEffect } from "react";
import { recordCourseVisit } from "@/lib/enrollmentTracker";

/**
 * Invisible client component that records a course visit
 * the first time a unique user views a course page.
 * This makes the enrollment counter truly live.
 */
export default function CourseEnrollmentTracker({ slug }: { slug: string }) {
  useEffect(() => {
    recordCourseVisit(slug);
  }, [slug]);

  return null; // Invisible — only records the visit
}
