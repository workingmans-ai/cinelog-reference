"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Film } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-slate-900 border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Film className="h-6 w-6 text-amber-500" />
            <span className="text-xl font-bold text-slate-50">CineLog</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                pathname === "/"
                  ? "text-amber-500"
                  : "text-slate-300 hover:text-amber-500"
              }`}
            >
              Search
            </Link>
            <Link
              href="/watched"
              className={`text-sm font-medium transition-colors ${
                pathname === "/watched"
                  ? "text-amber-500"
                  : "text-slate-300 hover:text-amber-500"
              }`}
            >
              Watched
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
