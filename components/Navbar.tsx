"use client";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const { isSignedIn, user } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#050505] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group min-w-[150px]">
          <span className="text-2xl font-extrabold tracking-tight">Edu<span className="text-primary">Nova</span></span>
        </Link>
        
        <div className="hidden md:flex flex-1 justify-center">
          <div className="flex items-center gap-8 text-sm font-medium text-gray-300">
            <Link className="hover:text-primary transition-colors" href="/#features">Features</Link>
            <Link className="hover:text-primary transition-colors" href="/courses">Courses</Link>
            {isSignedIn && (
              <Link className="text-primary/90 hover:text-primary transition-colors flex items-center gap-1.5" href="/my-courses">
                <span className="w-1 h-1 rounded-full bg-primary animate-pulse"></span>
                My Workspace
              </Link>
            )}
            <Link className="hover:text-primary transition-colors" href="/plans">Plans</Link>
            <Link className="hover:text-primary transition-colors" href="/#faq">FAQ</Link>
          </div>
        </div>

        <div className="flex items-center gap-4 min-w-[150px] justify-end">
          {!isSignedIn ? (
            <div className="hidden md:flex items-center gap-4">
              <SignInButton mode="modal">
                <button className="text-sm font-medium text-white px-4 py-2 hover:text-primary transition-colors">
                  Log In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-primary hover:bg-blue-600 text-white text-sm font-bold px-6 py-2 rounded-custom shadow-neon-blue transition-all">
                  Get Started
                </button>
              </SignUpButton>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              {user?.emailAddresses[0]?.emailAddress === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
                <Link href="/admin" className="text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-all">
                  Admin Portal
                </Link>
              )}
              <Link href="/billing" className="text-sm font-medium text-white px-4 py-2 hover:text-primary transition-colors">
                Billing
              </Link>
              <UserButton />
            </div>
          )}

          {/* Mobile hamburger button */}
          <div className="md:hidden flex items-center">
            {isSignedIn && <div className="mr-4"><UserButton /></div>}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle mobile menu"
            >
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path fillRule="evenodd" clipRule="evenodd" d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z" />
                ) : (
                  <path fillRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div 
        id="mobile-menu" 
        className={`md:hidden absolute top-20 left-0 w-full bg-[#050505] border-b border-white/10 transition-all duration-300 ${isMenuOpen ? 'max-h-96 py-4 opacity-100' : 'max-h-0 py-0 opacity-0 overflow-hidden'}`}
      >
        <div className="px-4 flex flex-col space-y-4">
          <Link className="text-gray-300 hover:text-primary transition-colors font-medium border-b border-white/5 pb-2" href="/#features" onClick={() => setIsMenuOpen(false)}>Features</Link>
          <Link className="text-gray-300 hover:text-primary transition-colors font-medium border-b border-white/5 pb-2" href="/courses" onClick={() => setIsMenuOpen(false)}>Courses</Link>
          <Link className="text-gray-300 hover:text-primary transition-colors font-medium border-b border-white/5 pb-2" href="/plans" onClick={() => setIsMenuOpen(false)}>Plans</Link>
          <Link className="text-gray-300 hover:text-primary transition-colors font-medium border-b border-white/5 pb-2" href="/#faq" onClick={() => setIsMenuOpen(false)}>FAQ</Link>
          
          {!isSignedIn ? (
            <div className="flex flex-col gap-3 pt-2">
              <Link href="/" className="w-full block text-center border border-white/20 text-white text-sm font-bold px-6 py-2 rounded transition-all" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <SignInButton mode="modal">
                <button className="w-full text-center text-sm font-medium text-white border border-white/20 px-4 py-2 hover:bg-white/5 transition-colors rounded">
                  Log In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="w-full bg-primary hover:bg-blue-600 text-white text-sm font-bold px-6 py-2 rounded shadow-neon-blue transition-all">
                  Get Started
                </button>
              </SignUpButton>
            </div>
          ) : (
            <div className="pt-2 flex flex-col gap-3">
              <Link href="/" className="w-full block text-center border border-white/20 text-white text-sm font-bold px-6 py-2 rounded transition-all" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link href="/billing" className="w-full block text-center border border-white/20 text-white text-sm font-bold px-6 py-2 rounded transition-all" onClick={() => setIsMenuOpen(false)}>
                Billing
              </Link>
              {user?.emailAddresses[0]?.emailAddress === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
                <Link href="/admin" className="w-full block text-center bg-primary/10 text-primary border border-primary/20 text-sm font-bold px-6 py-2 rounded transition-all" onClick={() => setIsMenuOpen(false)}>
                  Admin Portal
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
