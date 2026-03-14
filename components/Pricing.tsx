"use client";
import { useState } from "react";
import { SignInButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);
  const { isSignedIn, user } = useUser();

  const metadata = user?.unsafeMetadata || {};
  const currentPlan = metadata.plan as string | undefined;
  const status = metadata.status as string | undefined;
  const isActive = status === 'active';

  const proDescription = process.env.NEXT_PUBLIC_PRO_DESCRIPTION || "Accelerate your growth";
  const ultraDescription = process.env.NEXT_PUBLIC_ULTRA_DESCRIPTION || "Scale your entire team";

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
            <h3 className="text-xl font-bold mb-2">Free</h3>
            <p className="text-gray-500 text-sm mb-6">Start your journey</p>
            <div className="mb-8">
              <span className="text-4xl font-extrabold">Free</span>
              <span className="text-gray-500"> forever</span>
            </div>
            <div className="mt-auto pt-8">
              {currentPlan === 'free' || !currentPlan ? (
                <div className="text-center text-primary font-bold flex items-center justify-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  Current Plan
                </div>
              ) : (
                <div className="h-[46px]"></div> 
              )}
            </div>
          </div>
          {/* Tier 2 (Highlighted) */}
          <div className="glassmorphism p-8 rounded-custom flex flex-col h-full border-2 border-primary shadow-neon-blue relative transform md:-translate-y-4">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white">Most Popular</div>
            <h3 className="text-xl font-bold mb-2">Pro</h3>
            <p className="text-gray-500 text-sm mb-6">{proDescription}</p>
            <div className="mb-2">
              <span className="text-4xl font-extrabold">{isYearly ? '$162' : '$18.99'}</span>
              <span className="text-gray-500">{isYearly ? '/yr' : '/mo'}</span>
            </div>
            <div className="mb-6"></div>
            {isActive && currentPlan === 'pro' ? (
              <div className="mt-auto">
                <div className="text-center text-primary font-bold mb-2 flex items-center justify-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  Current Plan
                </div>
              </div>
            ) : isSignedIn ? (
              <Link href={`/checkout?planId=cplan_3ArQDgJIKa7sIYWHzzdbO8QBVIX&period=${isYearly ? 'year' : 'month'}`}>
                <div className="w-full py-3 rounded-custom bg-primary text-center cursor-pointer font-bold shadow-neon-blue transition-all mt-auto hover:scale-105">
                  {currentPlan ? 'Switch to Pro' : 'Subscribe'}
                </div>
              </Link>
            ) : (
              <SignInButton mode="modal" fallbackRedirectUrl="/#pricing">
                <div className="w-full py-3 rounded-custom bg-primary text-center cursor-pointer font-bold shadow-neon-blue transition-all mt-auto hover:scale-105">
                  Sign in to Subscribe
                </div>
              </SignInButton>
            )}
          </div>
          {/* Tier 3 */}
          <div className="glassmorphism p-8 rounded-custom flex flex-col h-full border border-white/10 hover:border-white/20 transition-all">
            <h3 className="text-xl font-bold mb-2">Ultra</h3>
            <p className="text-gray-500 text-sm mb-6">{ultraDescription}</p>
            <div className="mb-4">
              <span className="text-4xl font-extrabold">{isYearly ? '$239.88' : '$22.99'}</span>
              <span className="text-gray-500">{isYearly ? '/yr' : '/mo'}</span>
            </div>
            <div className="mb-6"></div>
            {isActive && currentPlan === 'ultra' ? (
              <div className="mt-auto">
                <div className="text-center text-primary font-bold mb-2 flex items-center justify-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  Current Plan
                </div>
              </div>
            ) : isSignedIn ? (
              <Link href={`/checkout?planId=cplan_3ArQSH4on7OwqIIQFZ1qgjpbNxB&period=${isYearly ? 'year' : 'month'}`}>
                <div className="w-full py-3 rounded-custom border border-white/20 text-center cursor-pointer font-bold hover:bg-white/5 transition-all mt-auto">
                  {currentPlan ? 'Switch to Ultra' : 'Subscribe'}
                </div>
              </Link>
            ) : (
              <SignInButton mode="modal" fallbackRedirectUrl="/#pricing">
                <div className="w-full py-3 rounded-custom border border-white/20 text-center cursor-pointer font-bold hover:bg-white/5 transition-all mt-auto">
                  Sign in to Subscribe
                </div>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
