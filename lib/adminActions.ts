"use server";

import { adminClient } from "@/sanity/lib/adminClient";
import { revalidatePath } from "next/cache";

/**
 * Creates a new module and links it to a course.
 */
export async function addModuleAction(courseId: string, title: string) {
  if (!process.env.SANITY_API_TOKEN) {
    throw new Error("Missing SANITY_API_TOKEN for mutations.");
  }

  try {
    // 1. Create the module document
    const newModule = await adminClient.create({
      _type: "module",
      title,
      lessons: [],
    });

    // 2. Link the module to the course
    await adminClient
      .patch(courseId)
      .setIfMissing({ modules: [] })
      .insert("after", "modules[-1]", [
        {
          _type: "reference",
          _ref: newModule._id,
          _key: `mod_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        },
      ])
      .commit();

    revalidatePath("/admin/courses");
    revalidatePath(`/admin/courses/${courseId}`);
    return { success: true, moduleId: newModule._id };
  } catch (error) {
    console.error("Add Module Error:", error);
    throw error;
  }
}

/**
 * Creates a new lesson and links it to a module.
 */
export async function addLessonAction(moduleId: string, title: string, courseId: string) {
  if (!process.env.SANITY_API_TOKEN) {
    throw new Error("Missing SANITY_API_TOKEN for mutations.");
  }

  try {
    // Generate a simple slug
    const slug = title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

    // 1. Create the lesson document
    const newLesson = await adminClient.create({
      _type: "lesson",
      title,
      slug: { _type: "slug", current: slug },
    });

    // 2. Link the lesson to the module
    await adminClient
      .patch(moduleId)
      .setIfMissing({ lessons: [] })
      .insert("after", "lessons[-1]", [
        {
          _type: "reference",
          _ref: newLesson._id,
          _key: `les_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        },
      ])
      .commit();

    revalidatePath("/admin/courses");
    revalidatePath(`/admin/courses/${courseId}`);
    return { success: true, lessonId: newLesson._id };
  } catch (error) {
    console.error("Add Lesson Error:", error);
    throw error;
  }
}

/**
 * Creates a brand new course document.
 */
export async function createCourseAction(details: {
  title: string;
  description: string;
  category: string;
  tier: string;
}) {
  if (!process.env.SANITY_API_TOKEN) {
    throw new Error("Missing SANITY_API_TOKEN for mutations.");
  }

  try {
    const slug = details.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    
    const newCourse = await adminClient.create({
      _type: "course",
      title: details.title,
      description: details.description,
      slug: { _type: "slug", current: slug },
      tier: details.tier,
      category: {
        _type: "reference",
        _ref: details.category,
      },
      modules: [],
    });

    revalidatePath("/admin/courses");
    revalidatePath("/courses");
    return { success: true, courseId: newCourse._id, slug: newCourse.slug.current };
  } catch (error) {
    console.error("Create Course Error:", error);
    throw error;
  }
}

/**
 * Fetches all available categories for the admin forms.
 */
export async function getCategoriesAction() {
  try {
    const categories = await adminClient.fetch(`*[_type == "category"] {
      _id,
      title
    }`);
    return categories;
  } catch (error) {
    console.error("Fetch Categories Error:", error);
    return [];
  }
}

/**
 * Updates any field of any document.
 */
export async function updateFieldAction(id: string, field: string, value: any) {
  if (!process.env.SANITY_API_TOKEN) {
    throw new Error("Missing SANITY_API_TOKEN for mutations.");
  }

  try {
    await adminClient
      .patch(id)
      .set({ [field]: value })
      .commit();

    revalidatePath("/admin/courses");
    return { success: true };
  } catch (error) {
    console.error("Update Field Error:", error);
    throw error;
  }
}

/**
 * Uploads a video file to Sanity and returns the asset reference.
 * Note: Requires the file to be passed via FormData.
 */
export async function uploadVideoAction(formData: FormData) {
  if (!process.env.SANITY_API_TOKEN) {
    throw new Error("Missing SANITY_API_TOKEN for mutations.");
  }

  const file = formData.get("video") as File;
  if (!file) throw new Error("No video file provided.");

  try {
    // Upload the asset to Sanity
    // The mux-input plugin handles the Mux side if we upload to the right type
    const asset = await adminClient.assets.upload("file", file, {
        filename: file.name,
        contentType: file.type,
    });

    return { 
      success: true, 
      assetId: asset._id 
    };
  } catch (error) {
    console.error("Video Upload Error:", error);
    throw error;
  }
}

/**
 * Deletes a course document.
 */
export async function deleteCourseAction(id: string) {
  if (!process.env.SANITY_API_TOKEN) {
    throw new Error("Missing SANITY_API_TOKEN for mutations.");
  }

  try {
    await adminClient.delete(id);
    revalidatePath("/admin/courses");
    revalidatePath("/courses");
    return { success: true };
  } catch (error) {
    console.error("Delete Course Error:", error);
    throw error;
  }
}

/**
 * Removes a module from a course and deletes it.
 */
export async function deleteModuleAction(courseId: string, moduleId: string) {
  if (!process.env.SANITY_API_TOKEN) {
    throw new Error("Missing SANITY_API_TOKEN for mutations.");
  }

  try {
    // 1. Remove reference from course
    await adminClient
      .patch(courseId)
      .unset([`modules[_ref == "${moduleId}"]` || `modules[._ref == "${moduleId}"]` ]) // Handle both potential ref formats
      .commit();

    // 2. Delete the module document itself
    await adminClient.delete(moduleId);

    revalidatePath(`/admin/courses/${courseId}`);
    return { success: true };
  } catch (error) {
    console.error("Delete Module Error:", error);
    throw error;
  }
}

/**
 * Removes a lesson from a module and deletes it.
 */
export async function deleteLessonAction(courseId: string, moduleId: string, lessonId: string) {
  if (!process.env.SANITY_API_TOKEN) {
    throw new Error("Missing SANITY_API_TOKEN for mutations.");
  }

  try {
    // 1. Remove reference from module
    await adminClient
      .patch(moduleId)
      .unset([`lessons[_ref == "${lessonId}"]` || `lessons[._ref == "${lessonId}"]` ])
      .commit();

    // 2. Delete the lesson document itself
    await adminClient.delete(lessonId);

    revalidatePath(`/admin/courses/${courseId}`);
    return { success: true };
  } catch (error) {
    console.error("Delete Lesson Error:", error);
    throw error;
  }
}
