"use client";
import { useState, useEffect } from "react";
import { Lock, BookOpen, Zap, Sparkles } from "lucide-react";
import { isStarted, startCourse, getEnrollmentCount } from "@/lib/enrollmentTracker";

interface LessonEnrollmentGuardProps {
  courseSlug: string;
  courseTitle: string;
  children: React.ReactNode;
}

export default function LessonEnrollmentGuard({ courseSlug, courseTitle, children }: LessonEnrollmentGuardProps) {
  const [enrolled, setEnrolled] = useState<boolean | null>(null);
  const [liveStudents, setLiveStudents] = useState(0);

  useEffect(() => {
    setEnrolled(isStarted(courseSlug));
    setLiveStudents(getEnrollmentCount(courseSlug));
  }, [courseSlug]);

  const handleStart = () => {
    startCourse(courseSlug);
    setEnrolled(true);
  };

  if (enrolled === null) return null; // Loading state

  if (!enrolled) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 animate-in fade-in zoom-in duration-500">
        <div className="glassmorphism p-12 lg:p-20 rounded-[40px] border border-white/10 text-center relative overflow-hidden shadow-2xl">
          {/* Animated background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -mr-32 -mt-32 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyberPurple/10 blur-[100px] rounded-full -ml-32 -mb-32 animate-pulse" />

          <div className="relative z-10">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-cyberPurple rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-neon-blue rotate-3 hover:rotate-0 transition-transform duration-500">
              <Lock className="w-10 h-10 text-white" />
            </div>

            <h2 className="text-4xl lg:text-5xl font-black mb-6 tracking-tighter leading-tight">
              Ready to <span className="text-primary italic">Start</span> Your Journey?
            </h2>
            
            <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              You are just one click away from unlocking <span className="text-white font-bold">{courseTitle}</span>. 
              Join <span className="text-primary font-black">{liveStudents}+ students</span> already learning this content.
            </p>

            <div className="flex flex-col items-center gap-6">
              <button
                onClick={handleStart}
                className="group relative bg-white text-black px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl active:scale-95 flex items-center gap-3 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Sparkles className="w-5 h-5 animate-spin-slow" />
                Start Course Now
              </button>
              
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                Mandatory enrollment required for access
              </p>
            </div>

            <div className="mt-16 pt-10 border-t border-white/5 grid grid-cols-2 gap-8">
              <div className="text-center">
                 <p className="text-white font-black text-xl mb-1">100%</p>
                 <p className="text-[10px] text-gray-500 uppercase font-bold">Lifetime Access</p>
              </div>
              <div className="text-center">
                 <p className="text-white font-black text-xl mb-1">Live</p>
                 <p className="text-[10px] text-gray-500 uppercase font-bold">Progress Tracking</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
