// components/Topbar.tsx
"use client";

export default function Topbar() {
  const username =
    typeof window !== "undefined"
      ? localStorage.getItem("adminName") || "VOLTRIX"
      : "VOLTRIX";

  return (
    <header className="voltrix-topbar">
      <div className="voltrix-topbar-title">PUBG MOBILE · PRODUCTION PANEL</div>
      <div className="voltrix-topbar-user">Logged in as {username}</div>
    </header>
  );
}
