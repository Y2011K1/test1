"use client";
import { useState } from "react";

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  // TODO: implement logic for pricing actions
  const handleChoosePlan = () => console.log('Choose Plan logic');
  const handleGetPro = () => console.log('Get Pro logic');
  const handleContactSales = () => console.log('Contact Sales logic');

  return (
    <section className="py-24 relative" id="pricing">
      <div className="glow-blob bg-cyberPurple top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-8">Flexible Pricing</h2>
          <div className="inline-flex items-center p-1 bg-white/5 rounded-full border border-white/10">
            <button 
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${!isYearly ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${isYearly ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Yearly
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Tier 1 */}
          <div className="glassmorphism p-8 rounded-custom flex flex-col h-full border border-white/10 hover:border-white/20 transition-all">
            <h3 className="text-xl font-bold mb-2">Basic</h3>
            <p className="text-gray-500 text-sm mb-6">Start your journey</p>
            <div className="mb-8">
              <span className="text-4xl font-extrabold">{isYearly ? '$290' : '$29'}</span>
              <span className="text-gray-500">{isYearly ? '/yr' : '/mo'}</span>
            </div>
            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                Access to 50+ courses
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                Community Forum Access
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                Mobile App Access
              </li>
            </ul>
            <button onClick={handleChoosePlan} disabled aria-disabled="true" className="w-full py-3 rounded-custom border border-white/20 font-bold hover:bg-white/5 transition-all opacity-50 cursor-not-allowed">Choose Plan</button>
          </div>
          {/* Tier 2 (Highlighted) */}
          <div className="glassmorphism p-8 rounded-custom flex flex-col h-full border-2 border-primary shadow-neon-blue relative transform md:-translate-y-4">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white">Most Popular</div>
            <h3 className="text-xl font-bold mb-2">Pro</h3>
            <p className="text-gray-500 text-sm mb-6">Accelerate your growth</p>
            <div className="mb-8">
              <span className="text-4xl font-extrabold">{isYearly ? '$790' : '$79'}</span>
              <span className="text-gray-500">{isYearly ? '/yr' : '/mo'}</span>
            </div>
            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                All 500+ Courses
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                AI Learning Assistant
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                Verified Certificates
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                Weekly Mentorship Live
              </li>
            </ul>
            <button onClick={handleGetPro} disabled aria-disabled="true" className="w-full py-3 rounded-custom bg-primary font-bold shadow-neon-blue transition-all opacity-50 cursor-not-allowed">Get Pro</button>
          </div>
          {/* Tier 3 */}
          <div className="glassmorphism p-8 rounded-custom flex flex-col h-full border border-white/10 hover:border-white/20 transition-all">
            <h3 className="text-xl font-bold mb-2">Enterprise</h3>
            <p className="text-gray-500 text-sm mb-6">Scale your entire team</p>
            <div className="mb-8">
              <span className="text-4xl font-extrabold">{isYearly ? '$1990' : '$199'}</span>
              <span className="text-gray-500">{isYearly ? '/yr' : '/mo'}</span>
            </div>
            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                Everything in Pro
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                Team Analytics Dashboard
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                Dedicated Account Manager
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                Custom Branding
              </li>
            </ul>
            <button onClick={handleContactSales} disabled aria-disabled="true" className="w-full py-3 rounded-custom border border-white/20 font-bold hover:bg-white/5 transition-all opacity-50 cursor-not-allowed">Contact Sales</button>
          </div>
        </div>
      </div>
    </section>
  );
}
