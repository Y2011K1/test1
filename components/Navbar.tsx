"use client";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const { isSignedIn } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 glassmorphism border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-custom flex items-center justify-center shadow-neon-blue">
            <span className="text-white font-bold text-xl">E</span>
          </div>
          <span className="text-2xl font-extrabold tracking-tight">Edu<span className="text-primary">Nova</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <a className="hover:text-primary transition-colors" href="#features">Features</a>
          <a className="hover:text-primary transition-colors" href="#courses">Courses</a>
          <a className="hover:text-primary transition-colors" href="#pricing">Pricing</a>
          <a className="hover:text-primary transition-colors" href="#faq">FAQ</a>
        </div>
        <div className="flex items-center gap-4">
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
              <Link href="/studio" className="text-sm font-medium text-white px-4 py-2 hover:text-primary transition-colors">
                Studio
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
        className={`md:hidden absolute top-20 left-0 w-full bg-black border-b border-white/10 glassmorphism transition-all duration-300 ${isMenuOpen ? 'max-h-96 py-4 opacity-100' : 'max-h-0 py-0 opacity-0 overflow-hidden'}`}
      >
        <div className="px-4 flex flex-col space-y-4">
          <a className="text-gray-300 hover:text-primary transition-colors font-medium border-b border-white/5 pb-2" href="#features" onClick={() => setIsMenuOpen(false)}>Features</a>
          <a className="text-gray-300 hover:text-primary transition-colors font-medium border-b border-white/5 pb-2" href="#courses" onClick={() => setIsMenuOpen(false)}>Courses</a>
          <a className="text-gray-300 hover:text-primary transition-colors font-medium border-b border-white/5 pb-2" href="#pricing" onClick={() => setIsMenuOpen(false)}>Pricing</a>
          <a className="text-gray-300 hover:text-primary transition-colors font-medium border-b border-white/5 pb-2" href="#faq" onClick={() => setIsMenuOpen(false)}>FAQ</a>
          
          {!isSignedIn ? (
            <div className="flex flex-col gap-3 pt-2">
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
            <div className="pt-2">
              <Link href="/studio" className="w-full block text-center bg-primary hover:bg-blue-600 text-white text-sm font-bold px-6 py-2 rounded shadow-neon-blue transition-all" onClick={() => setIsMenuOpen(false)}>
                Go to Studio
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
