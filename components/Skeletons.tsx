// Reusable skeleton shimmer components for loading states
export function SkeletonBox({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-white/5 rounded-xl animate-pulse ${className}`}
      aria-hidden="true"
    />
  );
}

export function CourseCardSkeleton() {
  return (
    <div className="glassmorphism rounded-custom overflow-hidden border border-white/5 flex flex-col">
      {/* Image area */}
      <SkeletonBox className="h-52 w-full rounded-none" />
      {/* Content */}
      <div className="p-8 flex flex-col flex-1 gap-4">
        <SkeletonBox className="h-4 w-24 rounded-full" />
        <SkeletonBox className="h-6 w-full" />
        <SkeletonBox className="h-4 w-3/4" />
        <div className="mt-auto space-y-3">
          <div className="flex justify-between">
            <SkeletonBox className="h-4 w-20" />
            <SkeletonBox className="h-4 w-16" />
          </div>
          <SkeletonBox className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
}

export function CourseDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <SkeletonBox className="h-5 w-32 rounded-full" />
            <SkeletonBox className="h-14 w-full" />
            <SkeletonBox className="h-14 w-4/5" />
            <SkeletonBox className="h-5 w-full" />
            <SkeletonBox className="h-5 w-3/4" />
            <SkeletonBox className="h-5 w-1/2" />
            <div className="pt-6 space-y-3">
              {[1,2,3].map(i => <SkeletonBox key={i} className="h-16" />)}
            </div>
          </div>
          <div>
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4">
              <SkeletonBox className="h-48" />
              <SkeletonBox className="h-12 w-full" />
              <SkeletonBox className="h-5 w-full" />
              <SkeletonBox className="h-5 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LessonPageSkeleton() {
  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <SkeletonBox className="h-8 w-64" />
        <SkeletonBox className="w-full" style={{ paddingBottom: "56.25%", position: "relative" }} />
        <div className="flex gap-4">
          <SkeletonBox className="h-12 flex-1" />
          <SkeletonBox className="h-12 flex-1" />
        </div>
      </div>
    </div>
  );
}

export function CourseGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <CourseCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-white/5">
      {[1,2,3,4,5,6].map(i => (
        <td key={i} className="px-6 py-4">
          <SkeletonBox className="h-5" />
        </td>
      ))}
    </tr>
  );
}
