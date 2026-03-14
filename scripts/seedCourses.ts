/**
 * Seed script to push the 5 specific courses (with modules, lessons, and categories)
 * into Sanity Studio so they appear in the CMS and can be managed there.
 *
 * Usage:
 *   1. Create a Sanity API write token at https://www.sanity.io/manage
 *   2. Add SANITY_API_TOKEN=<your-token> to .env.local
 *   3. Run: npx tsx scripts/seedCourses.ts
 */

import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset || !token) {
  console.error("❌ Missing environment variables. Make sure these are set in .env.local:");
  console.error("   NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_TOKEN");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-03-11",
  useCdn: false,
  token,
});

// ─── Category definitions ────────────────────────────────────────
const categories = [
  { _id: "cat-development", _type: "category", title: "Development", description: "Web and software development courses" },
  { _id: "cat-design", _type: "category", title: "Design", description: "UI/UX and visual design courses" },
  { _id: "cat-datascience", _type: "category", title: "Data Science", description: "Data analysis and machine learning courses" },
  { _id: "cat-business", _type: "category", title: "Business", description: "Business and entrepreneurship courses" },
  { _id: "cat-marketing", _type: "category", title: "Marketing", description: "Digital marketing and sales courses" },
];

const categoryMap: Record<string, string> = {
  Development: "cat-development",
  Design: "cat-design",
  "Data Science": "cat-datascience",
  Business: "cat-business",
  Marketing: "cat-marketing",
};

// ─── Course data (mirrors lib/courseData.ts) ─────────────────────
const coursesData = [
  {
    slug: "entrepreneurship-101",
    title: "Entrepreneurship 101",
    description: "Master the fundamentals of starting and scaling a successful business. From ideation to execution.",
    tier: "free",
    category: "Business",
    modules: [
      {
        title: "Foundations of Startup Success",
        lessons: [
          { title: "Ideation and Market Research" },
          { title: "Building Your MVP" },
        ],
      },
    ],
  },
  {
    slug: "data-science-beginners",
    title: "Data Science for Beginners",
    description: "Start your journey into the world of data. Learn Python, Pandas, and the basics of machine learning.",
    tier: "pro",
    category: "Data Science",
    modules: [
      {
        title: "Introduction to Python for Data",
        lessons: [
          { title: "Python Basics" },
          { title: "Working with DataFrames" },
        ],
      },
    ],
  },
  {
    slug: "advanced-ui-ux-masterclass",
    title: "Advanced UI/UX Masterclass",
    description: "Take your design skills to the next level with advanced prototyping, component systems, and UX research.",
    tier: "free",
    category: "Design",
    featured: true,
    modules: [
      {
        title: "Mastering Design Systems",
        lessons: [
          { title: "Building Scalable Components" },
          { title: "Advanced Prototyping in Figma" },
        ],
      },
    ],
  },
  {
    slug: "digital-marketing-strategies",
    title: "Digital Marketing Strategies",
    description: "Learn how to drive traffic, convert leads, and scale your brand using modern digital marketing techniques.",
    tier: "pro",
    category: "Marketing",
    modules: [],
  },
  {
    slug: "full-stack-bootcamp",
    title: "Full-Stack Web Development Bootcamp",
    description: "Become a professional developer. Master React, Node.js, and modern database architectures.",
    tier: "ultra",
    category: "Development",
    featured: true,
    modules: [
      {
        title: "Modern Frontend Artistry",
        lessons: [
          { title: "React 19 & Server Components" },
          { title: "Mastering Tailwind CSS" },
        ],
      },
      {
        title: "Scalable Backend Architecture",
        lessons: [
          { title: "Node.js & Express Foundations" },
          { title: "PostgreSQL & Prisma Integration" },
        ],
      },
    ],
  },
];

// ─── Helper to make a slug object ────────────────────────────────
function makeSlug(text: string) {
  return {
    _type: "slug",
    current: text,
  };
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ─── Main seed function ──────────────────────────────────────────
async function seed() {
  console.log("🌱 Starting seed...\n");

  // 1. Create categories
  console.log("📁 Creating categories...");
  const tx1 = client.transaction();
  for (const cat of categories) {
    tx1.createOrReplace(cat);
  }
  await tx1.commit();
  console.log(`   ✅ ${categories.length} categories created\n`);

  // 2. Create lessons, modules, and courses
  for (const courseData of coursesData) {
    console.log(`📚 Seeding: ${courseData.title}`);

    const moduleRefs: { _type: string; _ref: string; _key: string }[] = [];

    for (let mIdx = 0; mIdx < courseData.modules.length; mIdx++) {
      const mod = courseData.modules[mIdx];
      const lessonRefs: { _type: string; _ref: string; _key: string }[] = [];

      for (let lIdx = 0; lIdx < mod.lessons.length; lIdx++) {
        const les = mod.lessons[lIdx];
        const lessonId = `lesson-${courseData.slug}-m${mIdx}-l${lIdx}`;

        await client.createOrReplace({
          _id: lessonId,
          _type: "lesson",
          title: les.title,
          slug: makeSlug(slugify(les.title)),
        });

        lessonRefs.push({
          _type: "reference",
          _ref: lessonId,
          _key: `lkey-${lIdx}`,
        });
      }

      const moduleId = `module-${courseData.slug}-m${mIdx}`;
      await client.createOrReplace({
        _id: moduleId,
        _type: "module",
        title: mod.title,
        lessons: lessonRefs,
      });

      moduleRefs.push({
        _type: "reference",
        _ref: moduleId,
        _key: `mkey-${mIdx}`,
      });
    }

    // Create the course document
    const courseId = `course-${courseData.slug}`;
    await client.createOrReplace({
      _id: courseId,
      _type: "course",
      title: courseData.title,
      slug: makeSlug(courseData.slug),
      description: courseData.description,
      tier: courseData.tier,
      featured: courseData.featured || false,
      category: {
        _type: "reference",
        _ref: categoryMap[courseData.category],
      },
      modules: moduleRefs,
    });

    const totalLessons = courseData.modules.reduce((s, m) => s + m.lessons.length, 0);
    console.log(`   ✅ Created: ${courseData.modules.length} modules, ${totalLessons} lessons\n`);
  }

  console.log("🎉 Seed complete! All courses are now in Sanity Studio.");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
