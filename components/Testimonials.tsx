export default function Testimonials() {
  return (
    <section className="py-24 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-16">Stories from Our Graduates</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glassmorphism p-8 rounded-custom border-l-4 border-primary">
            <p className="text-gray-300 italic mb-8">"EduNova changed my career trajectory. The AI-driven paths helped me focus on what truly matters in the industry today."</p>
            <div className="flex items-center gap-4">
              <img alt="Jordan Smith" className="w-12 h-12 rounded-full border-2 border-primary" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC30jmklS_DSLOCHBCLAqyVABYqbYiTAs5VM60vEycMkuG_vVwr4PlFQaNy4964hIPrk4rAG9TpX7EKLdcPg54hGAzl0x0wvctlL1he2zNEu_Pbf35wau-atNknEYBk4gMIXtHEy5CcU6aQ6qn55f7L3OpXFJUeAlGp2azvis1qyEhakIR7EN1bFaxYoxBuhRSDV5UNAKdc8YCzpWd8u41WxTa7LF0A8gxO6jQjUi8gzRM9rHTsAG52joDMamQdX9CWyz_zJFKZf08m"/>
              <div>
                <h4 className="font-bold">Jordan Smith</h4>
                <p className="text-xs text-gray-500">Fullstack Developer at TechCo</p>
              </div>
            </div>
          </div>
          <div className="glassmorphism p-8 rounded-custom border-l-4 border-cyberPurple">
            <p className="text-gray-300 italic mb-8">"The community aspect is incredible. I found my current co-founder through a study group here. Best platform for network."</p>
            <div className="flex items-center gap-4">
              <img alt="Elara Vance" className="w-12 h-12 rounded-full border-2 border-cyberPurple" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC01nAio0RpgMscUQZ09P53AYAoIri7M2OrhyAB67okHVDpuNKXDLUIv6j7empf1c5YYJ0_Uua0geuu4wxjIVSnpSkxg4JCcyCc0BlhlmekZz9kTmyj2zE9bQC-jzo31RcdhmvIl0zl2rxvFJVc2d0mrRduFeOt-9MGNNILPSUDdbpJLEVYDPLttqzk3509ZPEvMsuRRVTnRB1MXZWHS6wn1Z6TzGmAfEd8HyxX34cQGRvBJneq5bIutWgjiw2-dFt471SCSM7CnZMw"/>
              <div>
                <h4 className="font-bold">Elara Vance</h4>
                <p className="text-xs text-gray-500">UI Designer at Visionary</p>
              </div>
            </div>
          </div>
          <div className="glassmorphism p-8 rounded-custom border-l-4 border-cyberPink">
            <p className="text-gray-300 italic mb-8">"As a beginner, I was intimidated. EduNova's interactive lessons made complex concepts feel like a walk in the park."</p>
            <div className="flex items-center gap-4">
              <img alt="Mike Chen" className="w-12 h-12 rounded-full border-2 border-cyberPink" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlW-bg2KSQMZUzlL83z-0vfK5ewy3EZ3AZc2wGGmDf--D2aFHozmTzz4pGOmwV-VhRe2VoTBCR-Kjj-UJt5NBD0la3NMbQo6mfPkwvO_2KLZHyUbkzffK4uxNKY6qmD6MxzrQRNJOuzUtP3WmHjpx8a3DadLJajYnSbozDfSVajJwDbg3lNtYn0qq_Hpt6_RMWLNXppAXfSiCn-Jl8CfG78L0ij2T505W0Qb2beNzC67Qlc-8lXOGWu10bGoXCcIzTY-dC3crJ1OTY"/>
              <div>
                <h4 className="font-bold">Mike Chen</h4>
                <p className="text-xs text-gray-500">Data Intern at Nexus</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
