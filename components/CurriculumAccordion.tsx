"use client";
import { useState, useEffect } from "react";
import { ChevronDown, PlayCircle, Lock, CheckCircle, Circle } from "lucide-react";
import { getCompletedLessons, toggleLessonComplete } from "@/lib/progressTracker";
import { isStarted } from "@/lib/enrollmentTracker";
import { formatDuration } from "@/lib/courseData";
import Link from "next/link";

interface Lesson {
  _id: string;
  title: string;
  duration?: string;
}

interface Module {
  _id: string;
  title: string;
  lessons: Lesson[];
}

interface CurriculumAccordionProps {
  modules: Module[];
  courseTier: string;
  userTier: string;
  courseSlug: string;
}

export default function CurriculumAccordion({ modules, courseTier, userTier, courseSlug }: CurriculumAccordionProps) {
  const [openModules, setOpenModules] = useState<string[]>([]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    setCompletedLessons(getCompletedLessons(courseSlug));
    setEnrolled(isStarted(courseSlug));
  }, [courseSlug]);

  const toggleModule = (id: string) => {
    setOpenModules(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleToggleLesson = (lessonId: string) => {
    const updated = toggleLessonComplete(courseSlug, lessonId);
    setCompletedLessons([...updated]);
  };

  const isTierAuthorized = () => {
    if (userTier === 'ultra') return true;
    if (userTier === 'pro') return courseTier === 'pro' || courseTier === 'free';
    return courseTier === 'free';
  };

  const authorized = isTierAuthorized();

  // Compute totals
  const totalLessons = modules.reduce((sum, m) => sum + (m.lessons || []).length, 0);
  const completedCount = completedLessons.length;
  const overallPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Overall progress bar */}
      <div className="glassmorphism rounded-xl border border-white/5 p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold ${overallPercent === 100 ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                overallPercent > 0 ? 'bg-primary/20 text-primary border border-primary/30' :
                  'bg-white/5 text-gray-500 border border-white/10'
              }`}>
              {overallPercent}%
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">
                {overallPercent === 100 ? "Course Complete! 🎉" :
                  overallPercent > 0 ? "In Progress" : "Not Started"}
              </h4>
              <p className="text-xs text-gray-500">
                {completedCount} of {totalLessons} lessons completed · {modules.length} {modules.length === 1 ? "module" : "modules"}
              </p>
            </div>
          </div>
          {authorized && overallPercent > 0 && overallPercent < 100 && (
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
              Keep going!
            </span>
          )}
        </div>
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${overallPercent === 100 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-primary shadow-neon-blue'
              }`}
            style={{ width: `${overallPercent}%` }}
          />
        </div>
      </div>

      {/* Module list */}
      {modules.map((module, idx) => {
        const moduleLessons = module.lessons || [];
        const moduleCompleted = moduleLessons.filter(l => completedLessons.includes(l._id)).length;
        const modulePercent = moduleLessons.length > 0 ? Math.round((moduleCompleted / moduleLessons.length) * 100) : 0;
        const isModuleComplete = modulePercent === 100 && moduleLessons.length > 0;

        return (
          <div key={module._id} className={`glassmorphism rounded-xl border overflow-hidden transition-all duration-300 ${isModuleComplete ? 'border-green-500/20' : 'border-white/5'
            }`}>
            <button
              onClick={() => toggleModule(module._id)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${isModuleComplete
                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                    : 'bg-primary/10 text-primary border-primary/20'
                  }`}>
                  {isModuleComplete ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                </span>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-200 group-hover:text-white transition-colors">{module.title}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-xs text-gray-500 uppercase tracking-widest">
                      {moduleCompleted}/{moduleLessons.length} LESSONS
                    </p>
                    {moduleLessons.length > 0 && (
                      <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${isModuleComplete ? 'bg-green-500' : 'bg-primary'
                            }`}
                          style={{ width: `${modulePercent}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${openModules.includes(module._id) ? 'rotate-180' : ''}`} />
            </button>

            <div className={`transition-all duration-300 ease-in-out ${openModules.includes(module._id) ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
              <div className="p-2 space-y-1 border-t border-white/5 bg-black/20">
                {moduleLessons.map((lesson) => {
                  const isComplete = completedLessons.includes(lesson._id);

                  return (
                    <div key={lesson._id} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-all group/lesson">
                      <div className="flex items-center gap-3 min-w-0">
                        {authorized ? (
                          (isComplete || enrolled)
                            ? <CheckCircle className={`w-4 h-4 shrink-0 ${isComplete ? 'text-green-500' : 'text-primary'}`} />
                            : <Lock className="w-4 h-4 text-gray-500 shrink-0" />
                        ) : (
                          <Lock className="w-4 h-4 text-gray-600 shrink-0" />
                        )}
                        {authorized ? (
                          enrolled ? (
                            <Link
                              href={`/courses/${courseSlug}/lessons/${lesson._id}`}
                              className={`text-sm transition-colors truncate ${isComplete ? 'text-green-400/70 line-through' :
                                  'text-gray-300 hover:text-primary'
                                }`}
                            >
                              {lesson.title}
                            </Link>
                          ) : (
                            <span className="text-sm text-gray-500 italic flex items-center gap-2 cursor-pointer hover:text-white transition-colors" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                              {lesson.title}
                              <span className="text-[8px] font-black bg-white/10 px-1.5 py-0.5 rounded uppercase tracking-widest text-gray-400">Enroll to View</span>
                            </span>
                          )
                        ) : (
                          <span className="text-sm text-gray-600 truncate">
                            {lesson.title}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-medium text-gray-500">{formatDuration(lesson.video?.asset?.data?.duration || lesson.duration)}</span>
                        {authorized && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleToggleLesson(lesson._id); }}
                            className="group/check"
                            title={isComplete ? "Mark as incomplete" : "Mark as complete"}
                          >
                            {isComplete ? (
                              <CheckCircle className="w-5 h-5 text-green-500 hover:text-green-300 transition-colors" />
                            ) : (
                              <Circle className="w-5 h-5 text-white/10 hover:text-primary transition-colors" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
