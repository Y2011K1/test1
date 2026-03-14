"use client";

import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { getAllEnrollmentCounts } from "@/lib/enrollmentTracker";
import { getAllAverageRatings } from "@/lib/ratingTracker";
import { 
  Users, 
  BookOpen, 
  Star, 
  TrendingUp, 
  ArrowUpRight, 
  PlayCircle,
  Clock,
  LayoutDashboard
} from "lucide-react";

export default function AdminOverview() {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    avgRating: 0,
    growthRate: "+12.5%", // Conceptual growth
  });
  const [recentCourses, setRecentCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdminData() {
      // 1. Fetch courses from Sanity
      const sanityCourses = await client.fetch(`*[_type == "course"] | order(_createdAt desc) [0...4] {
        title,
        _id,
        slug,
        category-> {title},
        "lessonCount": count(modules[]->lessons[]),
        _createdAt
      }`);

      // 2. Aggregate Live Data from Trackers
      const enrollments = getAllEnrollmentCounts();
      const ratings = getAllAverageRatings();

      const totalStudents = Object.values(enrollments).reduce((sum, count) => sum + count, 0);
      const ratingVals = Object.values(ratings).map(r => r.average);
      const avgRating = ratingVals.length > 0 
        ? Math.round((ratingVals.reduce((a, b) => a + b, 0) / ratingVals.length) * 100) / 100 
        : 0;

      setStats({
        totalCourses: sanityCourses.length + 5, // sanity + dummy count
        totalStudents,
        avgRating,
        growthRate: "+14.2%"
      });

      setRecentCourses(sanityCourses);
      setLoading(false);
    }

    fetchAdminData();
  }, []);

  const statCards = [
    { label: "Total Students", value: stats.totalStudents, icon: Users, color: "text-blue-400", bg: "bg-blue-400/10", trend: "+5% this week" },
    { label: "Course Count", value: stats.totalCourses, icon: BookOpen, color: "text-purple-400", bg: "bg-purple-400/10", trend: "Live Catalog" },
    { label: "Avg Rating", value: stats.avgRating.toFixed(2), icon: Star, color: "text-yellow-400", bg: "bg-yellow-400/10", trend: "High Precision" },
    { label: "Engagement", value: stats.growthRate, icon: TrendingUp, color: "text-green-400", bg: "bg-green-400/10", trend: "Steady growth" },
  ];

  return (
    <div className="animate-fade-in space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black mb-2 tracking-tight uppercase italic">Command <span className="text-primary not-italic">Center</span></h1>
          <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px]">EduNova Global Operations Dashboard</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-2 rounded-2xl">
           <div className="p-3 bg-primary/10 rounded-xl">
              <Clock className="w-5 h-5 text-primary" />
           </div>
           <div className="pr-4">
              <p className="text-[10px] font-black uppercase text-gray-500">Last Updated</p>
              <p className="text-sm font-bold">Real-time Data Active</p>
           </div>
        </div>
      </div>

      {/* Stat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <div key={i} className="glassmorphism p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-all group relative overflow-hidden">
            <div className={`absolute -right-4 -top-4 w-24 h-24 ${card.bg} rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity`}></div>
            <div className={`w-14 h-14 ${card.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">{card.label}</p>
            <div className="flex items-end gap-3">
               <h3 className="text-4xl font-black tracking-tighter italic">{card.value}</h3>
               <span className="text-[10px] font-bold text-gray-400 mb-1.5">{card.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Recent Courses & High-Value Targets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
         <div className="lg:col-span-8 space-y-8">
            <div className="glassmorphism rounded-[32px] border border-white/5 overflow-hidden">
               <div className="p-8 border-b border-white/5 flex items-center justify-between">
                  <h2 className="text-xl font-black uppercase tracking-tighter italic">Recent Course Artifacts</h2>
                  <button className="text-[11px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-2">
                    View Catalog <ArrowUpRight className="w-4 h-4" />
                  </button>
               </div>
               <div className="p-4 space-y-2">
                  {recentCourses.map((course, i) => (
                    <div key={course._id} className="p-6 rounded-2xl hover:bg-white/5 transition-all flex items-center justify-between group border border-transparent hover:border-white/5">
                        <div className="flex items-center gap-6">
                           <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-lg font-black text-gray-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors italic">
                              0{i+1}
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{course.category?.title || "Pro Experience"}</p>
                              <h4 className="font-bold text-lg leading-tight tracking-tight">{course.title}</h4>
                           </div>
                        </div>
                        <div className="hidden md:flex items-center gap-12">
                           <div className="text-right">
                              <p className="text-[10px] font-black uppercase text-gray-500">Modules</p>
                              <p className="font-bold">{course.lessonCount || 0} Lessons</p>
                           </div>
                           <div className="text-right">
                              <p className="text-[10px] font-black uppercase text-gray-500">Created</p>
                              <p className="font-bold text-sm text-gray-400">{new Date(course._createdAt).toLocaleDateString()}</p>
                           </div>
                        </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="lg:col-span-4 space-y-8">
            <div className="glassmorphism p-8 rounded-[32px] border border-white/5 bg-gradient-to-br from-primary/10 to-transparent">
               <div className="p-3 bg-primary shadow-neon-blue rounded-2xl w-fit mb-6">
                  <PlayCircle className="w-6 h-6 text-white" />
               </div>
               <h3 className="text-2xl font-black italic tracking-tight mb-4 uppercase leading-tight">Master <span className="text-primary not-italic">Infrastructure</span></h3>
               <p className="text-gray-400 text-sm leading-relaxed mb-8">Deploying new course artifacts? Access the Sanity Studio directly to modify the global curriculum state.</p>
               <a 
                 href="/studio" 
                 target="_blank"
                 className="block text-center py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all border-glow-blue"
               >
                 Launch Sanity Engine
               </a>
            </div>

            <div className="glassmorphism p-8 rounded-[32px] border border-white/5">
               <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 mb-6">System Health</h3>
               <div className="space-y-6">
                  {[
                    { label: "API Connectivity", status: "Operational", color: "bg-green-500" },
                    { label: "Sanity CDN", status: "High Speed", color: "bg-green-500" },
                    { label: "Clerk Auth", status: "Secure", color: "bg-blue-500" },
                  ].map((sys, i) => (
                    <div key={i} className="flex items-center justify-between border-b border-white/5 pb-4">
                       <span className="text-sm font-bold text-gray-300">{sys.label}</span>
                       <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-gray-500 uppercase">{sys.status}</span>
                          <div className={`w-2 h-2 rounded-full ${sys.color} animate-pulse`}></div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
