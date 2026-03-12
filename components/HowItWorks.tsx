export default function HowItWorks() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-5xl font-bold mb-20">Your Journey to Success</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
          {/* Connecting Lines (Visible on Desktop) */}
          <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-primary to-cyberPurple opacity-20 z-0"></div>
          <div className="relative z-10">
            <div className="w-24 h-24 mx-auto mb-8 bg-glassBg rounded-full flex items-center justify-center border border-primary/30 shadow-neon-blue">
              <span className="text-3xl font-extrabold text-primary">01</span>
            </div>
            <h3 className="text-xl font-bold mb-4">Sign Up</h3>
            <p className="text-gray-400">Create your futuristic profile and set your learning goals.</p>
          </div>
          <div className="relative z-10">
            <div className="w-24 h-24 mx-auto mb-8 bg-glassBg rounded-full flex items-center justify-center border border-cyberPurple/30 shadow-neon-purple">
              <span className="text-3xl font-extrabold text-cyberPurple">02</span>
            </div>
            <h3 className="text-xl font-bold mb-4">Choose Course</h3>
            <p className="text-gray-400">Select from hundreds of paths designed for modern tech stacks.</p>
          </div>
          <div className="relative z-10">
            <div className="w-24 h-24 mx-auto mb-8 bg-glassBg rounded-full flex items-center justify-center border border-cyberPink/30 shadow-neon-purple" style={{boxShadow: "0 0 15px rgba(255, 0, 193, 0.4)"}}>
              <span className="text-3xl font-extrabold text-cyberPink">03</span>
            </div>
            <h3 className="text-xl font-bold mb-4">Start Learning</h3>
            <p className="text-gray-400">Dive into interactive modules and gain real-world skills.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
