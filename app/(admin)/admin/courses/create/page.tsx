"use client";

import { useEffect, useState } from "react";
import { createCourseAction, getCategoriesAction } from "@/lib/adminActions";
import { 
  Plus, 
  ArrowLeft, 
  BookOpen, 
  Layout, 
  Loader2,
  Zap,
  Globe,
  Tag,
  AlignLeft,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreateCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tier: "free",
  });

  useEffect(() => {
    async function loadCategories() {
      const cats = await getCategoriesAction();
      setCategories(cats);
      if (cats.length > 0) {
        setFormData(prev => ({ ...prev, category: cats[0]._id }));
      }
    }
    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.category) return;
    
    setLoading(true);
    try {
      const res = await createCourseAction(formData);
      if (res.success) {
        router.push(`/admin/courses/${res.courseId}`);
      }
    } catch (err: any) {
      alert(err.message || "Failed to create course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto py-12">
      {/* Header */}
      <div className="mb-12">
        <Link href="/admin/courses" className="flex items-center gap-2 text-primary hover:underline text-[10px] font-black uppercase tracking-widest mb-4">
          <ArrowLeft className="w-3 h-3" /> Back to Catalog
        </Link>
        <h1 className="text-4xl lg:text-6xl font-black mb-2 tracking-tight uppercase italic leading-tight">
          Provision <span className="text-primary not-italic">Course</span>
        </h1>
        <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px]">Initialize a new educational artifact</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="glassmorphism p-10 rounded-[40px] border border-white/5 space-y-8">
          {/* Title Field */}
          <div className="space-y-3">
             <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 pl-2">
                <Tag className="w-3 h-3 text-primary" /> Artifact Title
             </label>
             <input 
               required
               type="text"
               placeholder="e.g., Quantum Computing Fundamentals"
               value={formData.title}
               onChange={(e) => setFormData({ ...formData, title: e.target.value })}
               className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-lg font-bold focus:border-primary focus:bg-white/[0.08] outline-none transition-all placeholder:text-gray-700"
             />
          </div>

          {/* Description Field */}
          <div className="space-y-3">
             <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 pl-2">
                <AlignLeft className="w-3 h-3 text-primary" /> Mission Statement / Description
             </label>
             <textarea 
               required
               rows={4}
               placeholder="Describe the knowledge transfer goals of this artifact..."
               value={formData.description}
               onChange={(e) => setFormData({ ...formData, description: e.target.value })}
               className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm font-medium focus:border-primary focus:bg-white/[0.08] outline-none transition-all placeholder:text-gray-700 resize-none"
             />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Category Field */}
            <div className="space-y-3">
               <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 pl-2">
                  <Layout className="w-3 h-3 text-primary" /> Subject Domain
               </label>
               <select 
                 required
                 value={formData.category}
                 onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                 className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm font-bold focus:border-primary focus:bg-white/[0.08] outline-none transition-all appearance-none cursor-pointer"
               >
                 {categories.map(cat => (
                   <option key={cat._id} value={cat._id} className="bg-black text-white">
                     {cat.title}
                   </option>
                 ))}
               </select>
            </div>

            {/* Tier Field */}
            <div className="space-y-3">
               <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 pl-2">
                  <ShieldCheck className="w-3 h-3 text-primary" /> Access Protocol
               </label>
               <div className="grid grid-cols-3 gap-3">
                  {['free', 'pro', 'ultra'].map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setFormData({ ...formData, tier })}
                      className={`py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                        formData.tier === tier 
                          ? 'bg-primary border-primary text-white shadow-neon-blue' 
                          : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
               </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-8 glassmorphism rounded-[32px] border border-white/5">
           <div className="flex items-center gap-4 text-gray-500">
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center animate-pulse">
                <Globe className="w-4 h-4" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Artifact Deployment</p>
           </div>
           <button 
             type="submit"
             disabled={loading || !formData.title || !formData.category}
             className="bg-primary px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-neon-blue active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
           >
             {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 fill-current" />}
             {loading ? "Initializing..." : "Deploy Artifact"}
           </button>
        </div>
      </form>
    </div>
  );
}
