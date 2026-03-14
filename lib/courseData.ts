/**
 * Shared dummy course data with REAL module/lesson arrays.
 * All counters (module count, lesson count) are computed dynamically
 * from these arrays — never hardcoded.
 */

export interface Lesson {
  _id: string;
  title: string;
  duration: string;
}

export interface Module {
  _id: string;
  title: string;
  lessons: Lesson[];
}

export interface DummyCourse {
  _id: string;
  title: string;
  description: string;
  tier: string;
  rating: number;
  category: string;
  duration: string;
  instructor: string;
  slug: { current: string };
  modules: Module[];
  featured?: boolean;
}

export const dummyCourses: DummyCourse[] = [
  {
    _id: "dummy_1",
    title: "Entrepreneurship 101",
    description: "Master the fundamentals of starting and scaling a successful business. From ideation to execution.",
    tier: "free",
    rating: 4.5,
    category: "Business",
    duration: "4h 30m",
    instructor: "Sarah Jenkins",
    slug: { current: "entrepreneurship-101" },
    modules: [
      {
        _id: "m1", title: "Foundations of Startup Success", lessons: [
          { _id: "l1", title: "Ideation and Market Research", duration: "15:00" },
          { _id: "l2", title: "Building Your MVP", duration: "20:00" }
        ]
      }
    ]
  },
  {
    _id: "dummy_2",
    title: "Data Science for Beginners",
    description: "Start your journey into the world of data. Learn Python, Pandas, and the basics of machine learning.",
    tier: "pro",
    rating: 4.7,
    category: "Data Science",
    duration: "8h 15m",
    instructor: "David Miller",
    slug: { current: "data-science-beginners" },
    modules: [
      {
        _id: "m1", title: "Introduction to Python for Data", lessons: [
          { _id: "l1", title: "Python Basics", duration: "12:00" },
          { _id: "l2", title: "Working with DataFrames", duration: "25:00" }
        ]
      }
    ]
  },
  {
    _id: "dummy_3",
    title: "Advanced UI/UX Masterclass",
    description: "Take your design skills to the next level with advanced prototyping, component systems, and UX research.",
    tier: "free",
    rating: 4.9,
    category: "Design",
    duration: "10h 00m",
    instructor: "Elena Rodriguez",
    slug: { current: "advanced-ui-ux-masterclass" },
    featured: true,
    modules: [
      {
        _id: "m1", title: "Mastering Design Systems", lessons: [
          { _id: "l1", title: "Building Scalable Components", duration: "18:00" },
          { _id: "l2", title: "Advanced Prototyping in Figma", duration: "22:00" }
        ]
      }
    ]
  },
  {
    _id: "dummy_4",
    title: "Digital Marketing Strategies",
    description: "Learn how to drive traffic, convert leads, and scale your brand using modern digital marketing techniques.",
    tier: "pro",
    rating: 4.6,
    category: "Marketing",
    duration: "6h 45m",
    instructor: "Mark Thompson",
    slug: { current: "digital-marketing-strategies" },
    modules: [] // User mentioned 0 modules in studio
  },
  {
    _id: "dummy_5",
    title: "Full-Stack Web Development Bootcamp",
    description: "Become a professional developer. Master React, Node.js, and modern database architectures.",
    tier: "ultra",
    rating: 4.8,
    category: "Development",
    duration: "40h 00m",
    instructor: "Alex Rivera",
    slug: { current: "full-stack-bootcamp" },
    featured: true,
    modules: [
      {
        _id: "m1", title: "Modern Frontend Artistry", lessons: [
          { _id: "l1", title: "React 19 & Server Components", duration: "30:00" },
          { _id: "l2", title: "Mastering Tailwind CSS", duration: "25:00" }
        ]
      },
      {
        _id: "m2", title: "Scalable Backend Architecture", lessons: [
          { _id: "l3", title: "Node.js & Express Foundations", duration: "35:00" },
          { _id: "l4", title: "PostgreSQL & Prisma Integration", duration: "40:00" }
        ]
      }
    ]
  }
];

/** Compute real module count from the modules array */
export function getModuleCount(course: any): number {
  return (course.modules || []).length;
}

/** Compute real total lesson count from the modules array */
export function getLessonCount(course: any): number {
  return (course.modules || []).reduce(
    (total: number, mod: any) => total + (mod.lessons || []).length,
    0
  );
}

/** 
 * Sums up all lesson durations and returns formatted string (e.g., "1h 45m" or "20m") 
 * Lessons can have duration in "mm:ss" string, a number of seconds, or 
 * in video.asset.data.duration (from Sanity Mux assets).
 */
export function getTotalDuration(course: any): string {
  let totalSeconds = 0;
  
  (course.modules || []).forEach((mod: any) => {
    (mod.lessons || []).forEach((les: any) => {
      // Priority 1: video.asset.data.duration (Dynamic from Sanity)
      // Priority 2: les.duration (Manual string or number)
      const rawDur = les.video?.asset?.data?.duration || les.duration;
      
      if (!rawDur) return;

      if (typeof rawDur === "string") {
        if (rawDur.includes(":")) {
          const [m, s] = rawDur.split(":").map(Number);
          totalSeconds += (m * 60) + s;
        } else {
          totalSeconds += Number(rawDur) || 0;
        }
      } else if (typeof rawDur === "number") {
        totalSeconds += rawDur;
      }
    });
  });

  if (totalSeconds === 0) return "0m";

  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);

  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

/** Formats seconds or string duration into a clean "m:ss" or "mm:ss" format */
export function formatDuration(dur: any): string {
  if (!dur) return "0:00";
  
  let seconds = 0;
  if (typeof dur === "string") {
    if (dur.includes(":")) return dur; // Already formatted
    seconds = Number(dur) || 0;
  } else {
    seconds = dur;
  }

  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Find a dummy course by slug */
export function getDummyCourseBySlug(slug: string): DummyCourse | undefined {
  return dummyCourses.find(c => c.slug.current === slug);
}
