import { defineQuery } from "next-sanity";

export const FEATURED_COURSES_QUERY = defineQuery(`*[
  _type == "course"
  && featured == true
] | order(_createdAt desc)[0...3] {
  _id,
  title,
  slug,
  description,
  tier,
  featured,
  thumbnail {
    asset-> {
      _id,
      url
    }
  },
  "moduleCount": count(modules),
  "lessonCount": count(modules[]->lessons[])
}`);

export const ALL_COURSES_QUERY = defineQuery(`*[
  _type == "course"
] | order(_createdAt desc) {
  _id,
  title,
  slug,
  description,
  tier,
  featured,
  thumbnail {
    asset-> {
      _id,
      url
    }
  },
  "category": category->title,
  "moduleCount": count(modules),
  "lessonCount": count(modules[]->lessons[])
}`);

export const CATEGORIES_QUERY = defineQuery(`*[
  _type == "category"
] | order(title asc) {
  _id,
  title,
  description,
  icon
}`);

export const COURSE_BY_SLUG_QUERY = defineQuery(`*[
  _type == "course" && slug.current == $slug
][0] {
  _id,
  title,
  slug,
  description,
  tier,
  featured,
  thumbnail {
    asset-> {
      _id,
      url
    }
  },
  "category": category->title,
  "modules": modules[]-> {
    _id,
    title,
    description,
    "lessons": lessons[]-> {
      _id,
      title,
      slug,
      description
    }
  }
}`);

export const LESSON_BY_SLUG_QUERY = defineQuery(`*[
  _type == "lesson" && slug.current == $slug
][0] {
  _id,
  title,
  slug,
  description,
  "video": video.asset->playbackId,
  content,
  completedBy
}`);