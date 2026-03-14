export default function Features() {
  return (
    <section className="py-24 relative" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">Powerful Features</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Everything you need to master new technologies in a futuristic learning environment.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="glassmorphism p-8 rounded-custom neon-border-blue transition-all group">
            <div className="w-12 h-12 bg-primary/10 rounded-custom flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9.663 17h4.674a1 1 0 00.908-.588l3.358-7.606A1 1 0 0017.695 7.5H6.305a1 1 0 00-.909 1.306l3.358 7.606a1 1 0 00.908.588z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Interactive Learning</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Engage with live coding environments and interactive quizzes that provide instant feedback.</p>
          </div>
          {/* Card 2 */}
          <div className="glassmorphism p-8 rounded-custom neon-border-blue transition-all group">
            <div className="w-12 h-12 bg-cyberPurple/10 rounded-custom flex items-center justify-center mb-6 text-cyberPurple group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Progress Tracking</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Monitor your growth with detailed analytics and personalized learning insights.</p>
          </div>
          {/* Card 3 */}
          <div className="glassmorphism p-8 rounded-custom neon-border-blue transition-all group">
            <div className="w-12 h-12 bg-cyberPink/10 rounded-custom flex items-center justify-center mb-6 text-cyberPink group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Global Access</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Learn from anywhere in the world with our globally distributed edge infrastructure.</p>
          </div>
          {/* Card 4 */}
          <div className="glassmorphism p-8 rounded-custom neon-border-blue transition-all group">
            <div className="w-12 h-12 bg-primary/10 rounded-custom flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Community</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Connect with peers in focused study groups and global discussion forums.</p>
          </div>
          {/* Card 5 */}
          <div className="glassmorphism p-8 rounded-custom neon-border-blue transition-all group">
            <div className="w-12 h-12 bg-cyberPurple/10 rounded-custom flex items-center justify-center mb-6 text-cyberPurple group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
            </div>
            <h3 className="text-xl font-bold mb-3">AI Learning</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Our AI assistant adjusts the curriculum based on your strengths and weaknesses.</p>
          </div>
          {/* Card 6 */}
          <div className="glassmorphism p-8 rounded-custom neon-border-blue transition-all group">
            <div className="w-12 h-12 bg-cyberPink/10 rounded-custom flex items-center justify-center mb-6 text-cyberPink group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Mobile Friendly</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Learn on the go with our fully optimized mobile app available on all devices.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
