import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Glow blobs for background */}
      <div className="glow-blob bg-primary top-20 -left-20"></div>
      <div className="glow-blob bg-cyberPurple bottom-20 -right-20"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6">
            Upgrade Your <span className="text-gradient">Skills</span>.
          </h1>
          <p className="text-gray-400 text-lg lg:text-xl mb-10 max-w-2xl mx-auto lg:mx-0">
            The next-generation LMS for creators, developers, and visionaries. Learn with AI-driven paths and join a community of 500k+ students worldwide.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link href="/courses">
              <button className="w-full sm:w-auto px-8 py-4 bg-primary rounded-custom font-bold text-white shadow-neon-blue hover:scale-105 transition-transform">
                Start Learning
              </button>
            </Link>
            <Link href="/courses">
              <button className="w-full sm:w-auto px-8 py-4 border border-white/20 rounded-custom font-bold text-white hover:bg-white/5 transition-colors">
                Explore Courses
              </button>
            </Link>
          </div>
        </div>
        <div className="flex-1 w-full max-w-2xl relative">
          {/* Mockup Placeholder */}
          <div className="relative glassmorphism rounded-xl p-4 shadow-2xl animate-float">
            <div className="w-full h-[400px] bg-black/40 rounded-lg flex items-center justify-center border border-white/5 overflow-hidden">
              <img alt="Platform Dashboard" className="w-full h-full object-cover opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBNvjWpzQRXFMFdFrOI-NLaxDQPzJepylgBeuBNYOxKKSSBojHI8oTRoiGyjl_HjwGm27bu_KC9OPKv9obV0Stsp0Gq4gUIQXz2PLQcYao2RZf7MJeykb12rxzUnA5olcG5kyMVJUsC_uxjW2u6EgiGPlQiq8RGi9AUG76vvchBUx9rjjmlZ9_zLKRBLUE1wIDnJRDvKILCuE1jKziy4o7sGPEcdBfluXQj6yK1u4LJZelJdXJgMFWRMThYXRDkKppeHokkqqjQsyM"/>
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-cyberPurple/20 blur-2xl rounded-full"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/20 blur-2xl rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
