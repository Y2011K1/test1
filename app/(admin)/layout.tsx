import AdminGuard from "@/components/AdminGuard";
import { 
  LayoutDashboard, 
  BookOpen, 
  Settings, 
  BarChart3, 
  LogOut,
  Zap,
  Home
} from "lucide-react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { label: "Overview", icon: LayoutDashboard, href: "/admin" },
    { label: "Courses", icon: BookOpen, href: "/admin/courses" },
    { label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
    { label: "Settings", icon: Settings, href: "/admin/settings" },
  ];

  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-black/40 backdrop-blur-3xl border-r border-white/5 flex flex-col shrink-0">
          {/* Logo */}
          <div className="p-6 flex items-center gap-3 border-b border-white/5">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5 text-white fill-current" />
            </div>
            <div>
              <span className="text-base font-black tracking-tight uppercase">EduNova</span>
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Admin</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all group"
              >
                <item.icon className="w-4 h-4 group-hover:text-blue-400 transition-colors" />
                <span className="text-sm font-semibold">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Divider + Homepage button */}
          <div className="px-3 pb-3 space-y-1 border-t border-white/5 pt-3">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all group w-full"
            >
              <Home className="w-4 h-4 group-hover:text-green-400 transition-colors" />
              <span className="text-sm font-semibold">Back to Homepage</span>
            </Link>
          </div>

          {/* User */}
          <div className="p-4 border-t border-white/5">
            <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3">
              <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8 rounded-lg" } }} />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Session</p>
                <p className="text-xs font-bold truncate">Admin Portal</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 h-screen overflow-y-auto relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />
          <div className="p-8 lg:p-10">
            {children}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}

