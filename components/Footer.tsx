import Link from "next/link";
import { Mail, Phone, Zap } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const exploreLinks = [
    { label: "Course Catalog", href: "/courses" },
    { label: "My Workspace", href: "/my-courses" },
    { label: "Pricing Plans", href: "/plans" },
  ];

  const companyLinks = [
    { label: "About Us", href: "/about" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Contact", href: "mailto:khatatbehy1@gmail.com" },
  ];

  return (
    <footer className="bg-[#060606] border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                <Zap className="w-4 h-4 text-white fill-current" />
              </div>
              <span className="text-lg font-black tracking-tight">EduNova</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xs">
              Redefining the digital learning experience for the creators of tomorrow.
            </p>
            <div className="space-y-2">
              <a
                href="mailto:khatatbehy1@gmail.com"
                className="flex items-center gap-2.5 text-sm text-gray-500 hover:text-blue-400 transition-colors"
              >
                <Mail className="w-4 h-4" />
                khatatbehy1@gmail.com
              </a>
              <a
                href="tel:+966560980921"
                className="flex items-center gap-2.5 text-sm text-gray-500 hover:text-blue-400 transition-colors"
              >
                <Phone className="w-4 h-4" />
                +966 56 098 0921
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-sm font-bold text-white mb-5">Explore</h4>
            <ul className="space-y-3">
              {exploreLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-bold text-white mb-5">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © {currentYear} EduNova LMS Platform. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
