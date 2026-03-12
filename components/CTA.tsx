export default function CTA() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glassmorphism rounded-2xl p-12 lg:p-20 text-center relative overflow-hidden border border-primary/20">
          <div className="glow-blob bg-primary -top-20 -right-20 opacity-30"></div>
          <div className="relative z-10">
            <h2 className="text-4xl lg:text-6xl font-extrabold mb-6">Start Your Learning<br/>Journey <span className="text-primary">Today</span></h2>
            <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">Join a global network of learners and start building the future you want. First week is on us.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto px-10 py-5 bg-primary rounded-custom font-extrabold text-white shadow-neon-blue hover:scale-105 transition-all">
                Get Started for Free
              </button>
              <button className="w-full sm:w-auto px-10 py-5 border border-white/20 rounded-custom font-bold hover:bg-white/5 transition-all">
                View Curriculum
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
