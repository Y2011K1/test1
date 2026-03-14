"use client";

import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { getAllEnrollmentCounts } from "@/lib/enrollmentTracker";
import { getAllAverageRatings } from "@/lib/ratingTracker";
import {
  TrendingUp, Users, Star, BookOpen, BarChart3, 
  PieChart, Activity, Award
} from "lucide-react";

export default function AdminAnalytics() {
  const [data, setData] = useState<{
    courses: any[];
    totalStudents: number;
    avgRating: number;
    topCourse: { title: string; enrollment: number } | null;
    ratingBreakdown: Record<string, number>;
  }>({ courses: [], totalStudents: 0, avgRating: 0, topCourse: null, ratingBreakdown: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      const sanityCourses = await client.fetch(`*[_type == "course"] | order(_createdAt desc) {
        _id, title, tier,
        "slug": slug.current,
        category-> { title },
        "moduleCount": count(modules[]),
        "lessonCount": count(modules[]->lessons[])
      }`);

      const enrollments = getAllEnrollmentCounts();
      const ratings = getAllAverageRatings();

      const totalStudents = Object.values(enrollments).reduce((a, b) => a + b, 0);
      const ratingVals = Object.values(ratings);
      const avgRating = ratingVals.length > 0
        ? ratingVals.reduce((s, r) => s + r.average, 0) / ratingVals.length
        : 0;

      const coursesWithStats = sanityCourses.map((c: any) => ({
        ...c,
        enrollment: enrollments[c.slug] || 0,
        rating: ratings[c.slug]?.average || 0,
        ratingCount: ratings[c.slug]?.count || 0,
      }));

      const sorted = [...coursesWithStats].sort((a, b) => b.enrollment - a.enrollment);
      const topCourse = sorted[0] ? { title: sorted[0].title, enrollment: sorted[0].enrollment } : null;

      const tierBreakdown = coursesWithStats.reduce((acc: any, c: any) => {
        acc[c.tier || "free"] = (acc[c.tier || "free"] || 0) + 1;
        return acc;
      }, {});

      setData({ courses: coursesWithStats, totalStudents, avgRating, topCourse, ratingBreakdown: tierBreakdown });
      setLoading(false);
    }
    fetchAnalytics();
  }, []);

  const statCards = [
    { label: "Total Enrollments", value: data.totalStudents, icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Avg Rating", value: data.avgRating.toFixed(2), icon: Star, color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { label: "Total Courses", value: data.courses.length, icon: BookOpen, color: "text-purple-400", bg: "bg-purple-400/10" },
    { label: "Top Enrolled", value: data.topCourse?.enrollment ?? 0, icon: Award, color: "text-green-400", bg: "bg-green-400/10" },
  ];

  const tierColors: Record<string, string> = {
    ultra: "bg-purple-500",
    pro: "bg-blue-500",
    free: "bg-green-500",
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-40 bg-white/5 rounded-xl animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-28 bg-white/5 rounded-2xl animate-pulse" />)}
        </div>
        <div className="h-64 bg-white/5 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Platform performance and course metrics</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mb-4`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">{card.label}</p>
            <p className="text-3xl font-black tracking-tight">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Tier Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
          <h2 className="font-bold text-base mb-5 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-blue-400" /> Course Tier Breakdown
          </h2>
          <div className="space-y-4">
            {Object.entries(data.ratingBreakdown).map(([tier, count]) => {
              const pct = Math.round((count / data.courses.length) * 100);
              return (
                <div key={tier}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-semibold capitalize">{tier}</span>
                    <span className="text-gray-400">{count} courses ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${tierColors[tier] || "bg-gray-500"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
          <h2 className="font-bold text-base mb-5 flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-400" /> Top Courses by Enrollment
          </h2>
          <div className="space-y-3">
            {data.courses
              .sort((a, b) => b.enrollment - a.enrollment)
              .slice(0, 5)
              .map((course, i) => (
                <div key={course._id} className="flex items-center gap-3">
                  <span className="w-6 text-xs font-black text-gray-600">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{course.title}</p>
                    <p className="text-xs text-gray-500">{course.lessonCount} lessons</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Users className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-sm font-bold">{course.enrollment}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Per-Course Table */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-blue-400" />
          <h2 className="font-bold text-sm">Course Performance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-3 text-xs text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-xs text-gray-500 uppercase tracking-wider text-center">Tier</th>
                <th className="px-6 py-3 text-xs text-gray-500 uppercase tracking-wider text-center">Students</th>
                <th className="px-6 py-3 text-xs text-gray-500 uppercase tracking-wider text-center">Rating</th>
                <th className="px-6 py-3 text-xs text-gray-500 uppercase tracking-wider text-center">Lessons</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.courses.map(course => (
                <tr key={course._id} className="hover:bg-white/[0.02]">
                  <td className="px-6 py-3 font-medium">{course.title}</td>
                  <td className="px-6 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase border ${
                      course.tier === "ultra" ? "border-purple-500/30 text-purple-400 bg-purple-500/10" :
                      course.tier === "pro" ? "border-blue-500/30 text-blue-400 bg-blue-500/10" :
                      "border-green-500/30 text-green-400 bg-green-500/10"
                    }`}>
                      {course.tier || "free"}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center font-bold">{course.enrollment}</td>
                  <td className="px-6 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="font-bold">{course.rating.toFixed(2)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-center text-gray-400">{course.lessonCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
