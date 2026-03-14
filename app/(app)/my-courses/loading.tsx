import { CourseGridSkeleton } from "@/components/Skeletons";
import { SkeletonBox } from "@/components/Skeletons";

export default function MyCoursesLoading() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 space-y-3">
          <SkeletonBox className="h-12 w-64" />
          <SkeletonBox className="h-5 w-96" />
        </div>
        <CourseGridSkeleton count={4} />
      </div>
    </div>
  );
}
