"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, ShieldAlert } from "lucide-react";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

/**
 * Higher-Order Component/Guard to protect admin routes.
 * Server-side protection is handled by Clerk middleware.
 * This component adds an additional client-side email check.
 */
export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      const email = user?.emailAddresses[0]?.emailAddress;
      if (email && ADMIN_EMAIL && email === ADMIN_EMAIL) {
        setAuthorized(true);
      } else {
        // Redirect non-admins to home
        router.push("/");
      }
    }
  }, [isLoaded, user, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Verifying Authority...</p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 text-center">
        <div className="glassmorphism p-12 rounded-3xl border border-white/10 max-w-md">
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-black mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-8">This portal is strictly reserved for the lead administrator.</p>
          <button
            onClick={() => router.push("/")}
            className="w-full bg-primary py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all"
          >
            Return to Safety
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
