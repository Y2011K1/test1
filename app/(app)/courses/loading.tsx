import { CourseGridSkeleton } from "@/components/Skeletons";
import { SkeletonBox } from "@/components/Skeletons";

export default function CoursesLoading() {
  return (
    <div className="min-h-screen bg-background text-white">
      <main className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="space-y-3">
              <SkeletonBox className="h-12 w-64" />
              <SkeletonBox className="h-5 w-80" />
            </div>
            <SkeletonBox className="h-9 w-36 rounded-full" />
          </div>
          <SkeletonBox className="h-14 w-full rounded-2xl" />
        </header>
        <CourseGridSkeleton count={6} />
      </main>
    </div>
  );
}
