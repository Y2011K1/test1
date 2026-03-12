import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function Navbar() {
  const { userId } = await auth();
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
          {!userId ? (
            <>
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
            </>
          ) : (
            <>
              <Link href="/studio" className="text-sm font-medium text-white px-4 py-2 hover:text-primary transition-colors">
                Studio
              </Link>
              <UserButton />
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
