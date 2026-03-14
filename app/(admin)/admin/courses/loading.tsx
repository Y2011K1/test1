import { Loader2 } from "lucide-react";
import { SkeletonBox, TableRowSkeleton } from "@/components/Skeletons";

export default function AdminCoursesLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <SkeletonBox className="h-8 w-48" />
          <SkeletonBox className="h-4 w-32" />
        </div>
        <SkeletonBox className="h-10 w-32 rounded-xl" />
      </div>
      <SkeletonBox className="h-10 w-full rounded-xl" />
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              {["Course","Students","Rating","Structure","Tier","Actions"].map(h => (
                <th key={h} className="px-6 py-4">
                  <SkeletonBox className="h-3 w-16" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[1,2,3,4,5].map(i => <TableRowSkeleton key={i} />)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
