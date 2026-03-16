"use client";

import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { getAllEnrollmentCounts } from "@/lib/enrollmentTracker";
import { getAllAverageRatings } from "@/lib/ratingTracker";
import { deleteCourseAction } from "@/lib/adminActions";
import { 
  Search, BookOpen, Users, Star, Settings, 
  Plus, Trash2, ExternalLink, Loader2
} from "lucide-react";
import Link from "next/link";

export default function AdminCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function fetchData() {
    const sanityCourses = await client.fetch(`*[_type == "course"] | order(_createdAt desc) {
      title, _id,
      "slug": slug.current,
      tier,
      category-> { title },
      "moduleCount": count(modules[]),
      "lessonCount": count(modules[]->lessons[])
    }`);
    const enrollments = getAllEnrollmentCounts();
    const ratings = getAllAverageRatings();
    const merged = sanityCourses.map((c: any) => ({
      ...c,
      enrollment: enrollments[c.slug] || 0,
      rating: ratings[c.slug]?.average || 0,
      ratingCount: ratings[c.slug]?.count || 0,
    }));
    setCourses(merged);
    setLoading(false);
  }

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (course: any) => {
    if (!confirm(`Delete "${course.title}"?\n\nThis is irreversible.`)) return;
    setDeletingId(course._id);
    try {
      await deleteCourseAction(course._id);
      setCourses(prev => prev.filter(c => c._id !== course._id));
    } catch (e: any) {
      console.error("Delete course error:", e);
      alert(`Delete failed: ${e.message || JSON.stringify(e)}`);
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = courses.filter(c =>
    c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tierColor: Record<string, string> = {
    ultra: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    pro: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    free: "bg-green-500/20 text-green-400 border-green-500/30",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Course Management</h1>
          <p className="text-gray-500 text-sm mt-1">{courses.length} courses in the platform</p>
        </div>
        <Link
          href="/admin/courses/create"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> New Course
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : (
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Students</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Rating</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Structure</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Tier</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map(course => (
                  <tr key={course._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center shrink-0">
                          <BookOpen className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{course.title}</p>
                          <p className="text-xs text-gray-500">{course.category?.title || "Uncategorized"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-bold text-white">{course.enrollment}</span>
                        <span className="text-xs text-gray-500">enrolled</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="font-bold text-white">{course.rating.toFixed(2)}</span>
                        <span className="text-xs text-gray-500">({course.ratingCount})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-white font-medium">{course.moduleCount} modules</span>
                      <p className="text-xs text-gray-500">{course.lessonCount} lessons</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase border ${tierColor[course.tier] || tierColor.free}`}>
                        {course.tier || "free"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/courses/${course._id}`}
                          className="p-2 rounded-lg bg-white/5 hover:bg-blue-600/20 hover:text-blue-400 transition-colors"
                          title="Manage content"
                        >
                          <Settings className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/courses/${course.slug}`}
                          target="_blank"
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                          title="Preview course"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(course)}
                          disabled={deletingId === course._id}
                          className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 transition-colors disabled:opacity-50"
                          title="Delete course"
                        >
                          {deletingId === course._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && !loading && (
            <div className="py-16 text-center">
              <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 font-semibold">No courses found</p>
              <p className="text-gray-600 text-sm mt-1">Try adjusting your search or create a new course.</p>
            </div>
          )}
        </div>
      )}

      {/* Summary footer */}
      {!loading && (
        <div className="flex items-center justify-between px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Users className="w-4 h-4" />
            <span>{courses.reduce((s, c) => s + c.enrollment, 0)} total enrolled students</span>
          </div>
          <span className="text-xs text-gray-600">{filtered.length} of {courses.length} shown</span>
        </div>
      )}
    </div>
  );
}
