import Link from "next/link";
import { Mail, Phone, MapPin, Zap, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "About EduNova",
  description: "Learn more about EduNova, our mission, and our team.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-white pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-white fill-current" />
          </div>
          <span className="text-2xl font-black">EduNova</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight mb-4">About Us</h1>
        <p className="text-gray-400 text-lg leading-relaxed mb-12">
          EduNova is a modern Learning Management System built for the next generation of developers, designers, and tech creators. We believe knowledge should be accessible, structured, and beautifully delivered.
        </p>

        <div className="space-y-6 text-gray-400 text-sm leading-relaxed mb-14">
          <p>Our platform combines enterprise-level content management with a clean, distraction-free learning experience. Every course is crafted with precision and designed to help you build real, in-demand skills.</p>
          <p>Whether you're just starting out or advancing your career, EduNova provides the structured paths, video lessons, and hands-on projects you need to succeed.</p>
        </div>

        <h2 className="text-xl font-bold mb-6">Get in Touch</h2>
        <div className="space-y-4">
          <a
            href="mailto:khatatbehy1@gmail.com"
            className="flex items-center gap-3 p-4 bg-white/[0.03] border border-white/10 rounded-xl hover:border-blue-500/30 transition-all group"
          >
            <div className="w-9 h-9 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <Mail className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Email</p>
              <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">khatatbehy1@gmail.com</p>
            </div>
          </a>
          <a
            href="tel:+966560980921"
            className="flex items-center gap-3 p-4 bg-white/[0.03] border border-white/10 rounded-xl hover:border-blue-500/30 transition-all group"
          >
            <div className="w-9 h-9 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <Phone className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Phone</p>
              <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">+966 56 098 0921</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
