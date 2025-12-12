"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearAuth, getUsername, useAuthGuard } from "@/lib/auth";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/tournaments", label: "Tournaments" },
  { href: "/dashboard/teams", label: "Teams & Players" },
  { href: "/dashboard/players", label: "Players" },
  { href: "/dashboard/live", label: "Live Production" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  useAuthGuard();
  const pathname = usePathname();
  const router = useRouter();
  const username = getUsername() ?? "VOLTRIX";

  function logout() {
    clearAuth();
    router.push("/");
  }

  return (
    <div className="min-h-screen flex bg-[radial-gradient(circle_at_top,#1b2845,#050713)] text-slate-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-950/80 border-r border-slate-800 flex flex-col">
        <div className="px-6 py-4 border-b border-slate-800">
          <div className="text-xs tracking-[0.35em] text-sky-300 mb-1">VOLTRIX ADMIN</div>
          <div className="text-[11px] text-slate-500">PUBG MOBILE · PRODUCTION PANEL</div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(item => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "block px-3 py-2 rounded-md text-sm " +
                  (active
                    ? "bg-slate-800 border border-sky-500/60 text-sky-100"
                    : "text-slate-300 hover:bg-slate-900")
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-slate-800 text-xs text-slate-500">
          Logged in as <span className="text-slate-200">{username}</span>
          <button onClick={logout} className="ml-2 text-red-400 hover:text-red-300">
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col">
        <header className="h-14 px-6 flex items-center justify-between border-b border-slate-800 text-xs text-slate-400">
          <div>PUBG MOBILE · PRODUCTION PANEL</div>
          <div>Environment: Local development</div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
