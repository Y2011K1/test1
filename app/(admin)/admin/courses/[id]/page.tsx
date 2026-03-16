"use client";

import { useEffect, useState, use } from "react";
import { client } from "@/sanity/lib/client";
import {
  addModuleAction,
  addLessonAction,
  updateFieldAction,
  uploadVideoAction,
  deleteModuleAction,
  deleteLessonAction
} from "@/lib/adminActions";
import {
  Plus, ArrowLeft, BookOpen, Video, Loader2,
  Trash2, Cloud, CheckCircle2, Edit2, Check, X, Save
} from "lucide-react";
import Link from "next/link";

type Lesson = { _id: string; title: string; description?: string; video?: any };
type Module = { _id: string; title: string; description?: string; lessons: Lesson[] };
type Course = { _id: string; title: string; description?: string; category?: { title: string }; modules: Module[] };

export const maxDuration = 300; // 5 minutes for video uploads

export default function ManageCourseView({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  // Module creation state
  const [moduleTitle, setModuleTitle] = useState("");
  const [addingModule, setAddingModule] = useState(false);
  const [moduleLoading, setModuleLoading] = useState(false);

  // Lesson creation state — per-module
  const [lessonInputs, setLessonInputs] = useState<Record<string, string>>({});
  const [addingLessonTo, setAddingLessonTo] = useState<string | null>(null);
  const [lessonLoading, setLessonLoading] = useState<string | null>(null);

  // Inline edit state
  const [editTarget, setEditTarget] = useState<{ id: string; field: string; value: string } | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  // Delete state
  const [deletingModule, setDeletingModule] = useState<string | null>(null);
  const [deletingLesson, setDeletingLesson] = useState<string | null>(null);

  // Video upload
  const [uploadingTo, setUploadingTo] = useState<string | null>(null);

  async function fetchData() {
    setLoading(true);
    const data = await client.fetch<Course>(`*[_type == "course" && _id == $id][0] {
      _id, title, description,
      category-> { title },
      modules[]-> {
        _id, title, description,
        lessons[]-> { _id, title, description, video }
      }
    }`, { id });
    setCourse(data);
    setLoading(false);
  }

  useEffect(() => { fetchData(); }, [id]);

  // ---- Module Actions ----
  const handleAddModule = async () => {
    if (!moduleTitle.trim()) return;
    setModuleLoading(true);
    try {
      await addModuleAction(id, moduleTitle.trim());
      setModuleTitle("");
      setAddingModule(false);
      await fetchData();
    } catch (e: any) { 
      console.error("Add Module Error:", e);
      alert(`Failed to add module: ${e.message || JSON.stringify(e)}`); 
    }
    finally { setModuleLoading(false); }
  };

  const handleDeleteModule = async (moduleId: string, moduleTitle: string) => {
    if (!confirm(`Delete module "${moduleTitle}"? All its lessons references will be removed.`)) return;
    setDeletingModule(moduleId);
    try {
      await deleteModuleAction(id, moduleId);
      await fetchData();
    } catch (e: any) { 
      console.error("Delete Module Error:", e);
      alert(`Failed to delete module: ${e.message || JSON.stringify(e)}`); 
    }
    finally { setDeletingModule(null); }
  };

  // ---- Lesson Actions ----
  const handleAddLesson = async (moduleId: string) => {
    const title = (lessonInputs[moduleId] || "").trim();
    if (!title) return;
    setLessonLoading(moduleId);
    try {
      await addLessonAction(moduleId, title, id);
      setLessonInputs(prev => ({ ...prev, [moduleId]: "" }));
      setAddingLessonTo(null);
      await fetchData();
    } catch (e: any) { 
      console.error("Add Lesson Error:", e);
      alert(`Failed to add lesson: ${e.message || JSON.stringify(e)}`); 
    }
    finally { setLessonLoading(null); }
  };

  const handleDeleteLesson = async (moduleId: string, lessonId: string, lessonTitle: string) => {
    if (!confirm(`Delete lesson "${lessonTitle}"?`)) return;
    setDeletingLesson(lessonId);
    try {
      await deleteLessonAction(id, moduleId, lessonId);
      await fetchData();
    } catch (e: any) { 
      console.error("Delete Lesson Error:", e);
      alert(`Failed to delete lesson: ${e.message || JSON.stringify(e)}`); 
    }
    finally { setDeletingLesson(null); }
  };

  // ---- Inline Edit ----
  const startEdit = (docId: string, field: string, currentValue: string) => {
    setEditTarget({ id: docId, field, value: currentValue || "" });
  };

  const commitEdit = async () => {
    if (!editTarget) return;
    setEditLoading(true);
    try {
      await updateFieldAction(editTarget.id, editTarget.field, editTarget.value);
      setEditTarget(null);
      await fetchData();
    } catch (e: any) { alert(e.message || "Update failed."); }
    finally { setEditLoading(false); }
  };

  // ---- Video Upload ----
  const handleVideoUpload = async (lessonId: string, file: File) => {
    setUploadingTo(lessonId);
    try {
      const fd = new FormData();
      fd.append("video", file);
      const res = await uploadVideoAction(fd);
      if (res.success) {
        await updateFieldAction(lessonId, "video", {
          _type: "file",
          asset: { _type: "reference", _ref: res.assetId }
        });
        await fetchData();
      }
    } catch (e: any) { alert(e.message || "Upload failed."); }
    finally { setUploadingTo(null); }
  };

  // ---- Render ----
  if (loading && !course) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Course not found.</p>
        <Link href="/admin/courses" className="text-blue-400 hover:underline mt-2 block">← Back to Courses</Link>
      </div>
    );
  }

  const EditableText = ({ docId, field, value, className = "" }: { docId: string; field: string; value: string; className?: string }) => {
    const isEditing = editTarget?.id === docId && editTarget?.field === field;
    if (isEditing) {
      return (
        <div className="flex items-center gap-2">
          <input
            autoFocus
            value={editTarget.value}
            onChange={e => setEditTarget({ ...editTarget!, value: e.target.value })}
            onKeyDown={e => { if (e.key === "Enter") commitEdit(); if (e.key === "Escape") setEditTarget(null); }}
            className="bg-white/10 border border-blue-500/50 rounded-lg px-3 py-1 text-sm outline-none flex-1"
          />
          <button onClick={commitEdit} disabled={editLoading} className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-700">
            {editLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
          </button>
          <button onClick={() => setEditTarget(null)} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      );
    }
    return (
      <span
        className={`cursor-pointer hover:text-blue-400 transition-colors group/edit inline-flex items-center gap-2 ${className}`}
        onClick={() => startEdit(docId, field, value)}
      >
        {value || <span className="italic text-gray-600">Click to add...</span>}
        <Edit2 className="w-3 h-3 opacity-0 group-hover/edit:opacity-50 transition-opacity shrink-0" />
      </span>
    );
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <Link href="/admin/courses" className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 mb-3">
            <ArrowLeft className="w-4 h-4" /> Back to Courses
          </Link>
          <h1 className="text-2xl font-black tracking-tight">
            <EditableText docId={course._id} field="title" value={course.title} />
          </h1>
          <p className="text-sm text-gray-500 mt-1">{course.category?.title}</p>
        </div>
        <button
          onClick={() => { setAddingModule(true); setModuleTitle(""); }}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Module
        </button>
      </div>

      {/* Add Module Form */}
      {addingModule && (
        <div className="bg-white/[0.03] border border-blue-500/30 rounded-2xl p-5">
          <p className="text-sm font-bold mb-3 text-blue-400">New Module</p>
          <div className="flex items-center gap-3">
            <input
              autoFocus
              type="text"
              placeholder="Module title..."
              value={moduleTitle}
              onChange={e => setModuleTitle(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleAddModule(); if (e.key === "Escape") setAddingModule(false); }}
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-blue-500/50 transition-all"
            />
            <button
              onClick={handleAddModule}
              disabled={!moduleTitle.trim() || moduleLoading}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50 flex items-center gap-2"
            >
              {moduleLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Add
            </button>
            <button
              onClick={() => setAddingModule(false)}
              className="px-4 py-2.5 rounded-xl text-sm font-bold bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Modules List */}
      {course.modules?.length === 0 && !addingModule ? (
        <div className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-2xl">
          <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="font-semibold text-gray-400">No modules yet</p>
          <p className="text-sm text-gray-600 mt-1 mb-6">Start building your course by adding the first module.</p>
          <button
            onClick={() => setAddingModule(true)}
            className="bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl font-bold text-sm"
          >
            Add First Module
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {course.modules?.map((module, mIdx) => (
            <div key={module._id} className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
              {/* Module Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/[0.02]">
                <div className="flex items-center gap-3 flex-1">
                  <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 text-xs font-black shrink-0">
                    {mIdx + 1}
                  </span>
                  <div className="flex-1">
                    <div className="font-semibold text-white">
                      <EditableText docId={module._id} field="title" value={module.title} />
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {module.lessons?.length || 0} lessons
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setAddingLessonTo(module._id);
                      setLessonInputs(prev => ({ ...prev, [module._id]: "" }));
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Lesson
                  </button>
                  <button
                    onClick={() => handleDeleteModule(module._id, module.title)}
                    disabled={deletingModule === module._id}
                    className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors disabled:opacity-50"
                  >
                    {deletingModule === module._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Add Lesson Input */}
              {addingLessonTo === module._id && (
                <div className="px-5 py-3 border-b border-white/10 bg-blue-600/[0.03]">
                  <div className="flex items-center gap-3">
                    <Video className="w-4 h-4 text-blue-400 shrink-0" />
                    <input
                      autoFocus
                      type="text"
                      placeholder="Lesson title..."
                      value={lessonInputs[module._id] || ""}
                      onChange={e => setLessonInputs(prev => ({ ...prev, [module._id]: e.target.value }))}
                      onKeyDown={e => { if (e.key === "Enter") handleAddLesson(module._id); if (e.key === "Escape") setAddingLessonTo(null); }}
                      className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500/50"
                    />
                    <button
                      onClick={() => handleAddLesson(module._id)}
                      disabled={!lessonInputs[module._id]?.trim() || lessonLoading === module._id}
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg text-sm font-bold disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {lessonLoading === module._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                      Save
                    </button>
                    <button
                      onClick={() => setAddingLessonTo(null)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Lessons */}
              <div className="divide-y divide-white/5">
                {module.lessons?.length === 0 && addingLessonTo !== module._id && (
                  <div className="px-5 py-4 text-sm text-gray-600 italic flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    No lessons yet — click "Add Lesson" to get started.
                  </div>
                )}
                {module.lessons?.map((lesson, lIdx) => (
                  <div key={lesson._id} className="flex items-center gap-4 px-5 py-3 group hover:bg-white/[0.02] transition-colors">
                    <span className="w-6 h-6 flex items-center justify-center rounded-md bg-white/5 text-xs font-bold text-gray-500 shrink-0">
                      {lIdx + 1}
                    </span>

                    {/* Lesson Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white">
                        <EditableText docId={lesson._id} field="title" value={lesson.title} />
                      </div>
                      <div className="text-xs text-gray-600 mt-0.5">
                        <EditableText docId={lesson._id} field="description" value={lesson.description || ""} className="text-gray-500" />
                      </div>
                    </div>

                    {/* Video Status */}
                    <div className="shrink-0">
                      {uploadingTo === lesson._id ? (
                        <div className="flex items-center gap-1.5 text-xs text-blue-400">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Uploading...
                        </div>
                      ) : lesson.video ? (
                        <div className="flex items-center gap-1.5 text-xs text-green-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Video ready
                        </div>
                      ) : (
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={e => e.target.files?.[0] && handleVideoUpload(lesson._id, e.target.files[0])}
                          />
                          <div
                            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-400 transition-colors"
                            onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                            onDrop={e => {
                              e.preventDefault();
                              const file = e.dataTransfer.files?.[0];
                              if (file?.type.startsWith("video/")) handleVideoUpload(lesson._id, file);
                            }}
                          >
                            <Cloud className="w-3.5 h-3.5" />
                            Upload video
                          </div>
                        </label>
                      )}
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteLesson(module._id, lesson._id, lesson.title)}
                      disabled={deletingLesson === lesson._id}
                      className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-gray-600 hover:text-red-400 transition-all disabled:opacity-50"
                      title="Delete lesson"
                    >
                      {deletingLesson === lesson._id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
