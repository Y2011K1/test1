"use server";

import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { revalidatePath } from "next/cache";

/**
 * Creates a module-scoped admin client to ensure token is fresh.
 */
function getAdminClient() {
  const token = process.env.SANITY_API_TOKEN;
  if (!token) {
    console.error("[getAdminClient] CRITICAL: SANITY_API_TOKEN is missing!");
    throw new Error("SANITY_API_TOKEN is missing in server environment.");
  }
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token,
  });
}

/**
 * Creates a new module and links it to a course.
 */
export async function addModuleAction(courseId: string, title: string) {
  console.log(`[adminActions] addModuleAction starting for course: ${courseId}, title: ${title}`);
  const client = getAdminClient();
  
  try {
    const newModule = await client.create({
      _type: "module",
      title,
      lessons: [],
    });
    console.log(`[adminActions] Created module: ${newModule._id}`);

    await client
      .patch(courseId)
      .setIfMissing({ modules: [] })
      .insert("after", "modules[-1]", [
        {
          _type: "reference",
          _ref: newModule._id,
          _key: `mod_${Date.now()}`,
        },
      ])
      .commit();

    revalidatePath("/admin/courses");
    revalidatePath(`/admin/courses/${courseId}`);
    return { success: true, moduleId: newModule._id };
  } catch (error: any) {
    console.error("[adminActions] Add Module Error:", error);
    throw new Error(`Add Module failed: ${error.message}`);
  }
}

/**
 * Creates a new lesson and links it to a module.
 */
export async function addLessonAction(moduleId: string, title: string, courseId: string) {
  console.log(`[adminActions] addLessonAction starting for module: ${moduleId}, title: ${title}`);
  const client = getAdminClient();

  try {
    const slug = title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

    const newLesson = await client.create({
      _type: "lesson",
      title,
      slug: { _type: "slug", current: slug },
    });
    console.log(`[adminActions] Created lesson: ${newLesson._id}`);

    await client
      .patch(moduleId)
      .setIfMissing({ lessons: [] })
      .insert("after", "lessons[-1]", [
        {
          _type: "reference",
          _ref: newLesson._id,
          _key: `les_${Date.now()}`,
        },
      ])
      .commit();

    revalidatePath("/admin/courses");
    revalidatePath(`/admin/courses/${courseId}`);
    return { success: true, lessonId: newLesson._id };
  } catch (error: any) {
    console.error("[adminActions] Add Lesson Error:", error);
    throw new Error(`Add Lesson failed: ${error.message}`);
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
  console.log(`[adminActions] createCourseAction starting for: ${details.title}`);
  const client = getAdminClient();

  try {
    const slug = details.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    
    const newCourse = await client.create({
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
    console.log(`[adminActions] Course created successfully: ${newCourse._id}`);
    return { success: true, courseId: newCourse._id, slug: newCourse.slug.current };
  } catch (error: any) {
    console.error("[adminActions] Create Course Error:", error);
    throw new Error(`Create Course failed: ${error.message}`);
  }
}

/**
 * Fetches all available categories for the admin forms.
 */
export async function getCategoriesAction() {
  const client = getAdminClient();
  try {
    const categories = await client.fetch(`*[_type == "category"] {
      _id,
      title
    }`);
    return categories;
  } catch (error) {
    console.error("[adminActions] Fetch Categories Error:", error);
    return [];
  }
}

/**
 * Updates any field of any document.
 */
export async function updateFieldAction(id: string, field: string, value: any) {
  const client = getAdminClient();
  try {
    await client
      .patch(id)
      .set({ [field]: value })
      .commit();

    revalidatePath("/admin/courses");
    return { success: true };
  } catch (error: any) {
    console.error("[adminActions] Update Field Error:", error);
    throw new Error(`Update Field failed: ${error.message}`);
  }
}

/**
 * Uploads a video file to Sanity and returns the asset reference.
 * We set a high maxDuration for this specific action to handle large files.
 */
export async function uploadVideoAction(formData: FormData) {
  const client = getAdminClient();
  const file = formData.get("video") as File;
  if (!file) throw new Error("No video file provided.");

  const fileName = file.name;
  const contentType = file.type;
  const size = file.size;

  console.log(`[adminActions] Video upload start: ${fileName} (${(size / 1024 / 1024).toFixed(2)} MB)`);

  try {
    // Convert File to a stream for Sanity upload
    const stream = file.stream();
    
    const asset = await client.assets.upload("file", stream as any, {
        filename: fileName,
        contentType: contentType,
    });

    console.log(`[adminActions] Video upload success: ${asset._id}`);
    return { 
      success: true, 
      assetId: asset._id 
    };
  } catch (error: any) {
    console.error(`[adminActions] Video Upload Error for ${fileName}:`, error);
    throw new Error(`Video Upload failed: ${error.message || "Unknown error"}`);
  }
}

/**
 * Deletes a course document.
 */
export async function deleteCourseAction(id: string) {
  const client = getAdminClient();
  try {
    await client.delete(id);
    revalidatePath("/admin/courses");
    revalidatePath("/courses");
    return { success: true };
  } catch (error: any) {
    console.error("[adminActions] Delete Course Error:", error);
    throw new Error(`Delete Course failed: ${error.message}`);
  }
}

/**
 * Removes a module from a course and deletes it.
 */
export async function deleteModuleAction(courseId: string, moduleId: string) {
  const client = getAdminClient();
  try {
    await client
      .patch(courseId)
      .unset([`modules[_ref == "${moduleId}"]`])
      .commit();

    await client.delete(moduleId);

    revalidatePath("/admin/courses");
    revalidatePath(`/admin/courses/${courseId}`);
    return { success: true };
  } catch (error: any) {
    console.error("[adminActions] Delete Module Error:", error);
    throw new Error(`Delete Module failed: ${error.message}`);
  }
}

/**
 * Removes a lesson from a module and deletes it.
 */
export async function deleteLessonAction(courseId: string, moduleId: string, lessonId: string) {
  const client = getAdminClient();
  try {
    await client
      .patch(moduleId)
      .unset([`lessons[_ref == "${lessonId}"]`])
      .commit();

    await client.delete(lessonId);

    revalidatePath("/admin/courses");
    revalidatePath(`/admin/courses/${courseId}`);
    return { success: true };
  } catch (error: any) {
    console.error("[adminActions] Delete Lesson Error:", error);
    throw new Error(`Delete Lesson failed: ${error.message}`);
  }
}
