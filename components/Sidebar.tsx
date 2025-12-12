// components/Sidebar.tsx
"use client";

import Link from "next/link";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/tournaments", label: "Tournaments" },
  { href: "/dashboard/teams", label: "Teams & Players" },
  { href: "/dashboard/players", label: "Players" },
  { href: "/dashboard/live", label: "Live Production" },
];

export default function Sidebar({ currentPath }: { currentPath: string }) {
  return (
    <aside className="voltrix-sidebar">
      <div className="voltrix-sidebar-logo">VOLTRIX ADMIN</div>

      <div>
        <div className="voltrix-sidebar-section-title">Control Room</div>
        <nav className="voltrix-nav">
          {navItems.map((item) => {
            const active =
              currentPath === item.href ||
              (item.href !== "/dashboard" &&
                currentPath.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "voltrix-nav-link" +
                  (active ? " voltrix-nav-link-active" : "")
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
