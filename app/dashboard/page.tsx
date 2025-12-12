"use client";

export default function DashboardOverviewPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">Control Room</h1>
      <p className="text-sm text-slate-400 mb-6">
        Manage PUBG Mobile tournaments, teams and live production overlays from
        one panel.
      </p>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <OverviewCard
          title="Tournaments"
          description="Create, configure and schedule PUBG Mobile tournaments from one place."
          href="/dashboard/tournaments"
          link="Open tournaments →"
        />
        <OverviewCard
          title="Teams & Players"
          description="Maintain team tags, rosters and player IDs ready for production."
          href="/dashboard/teams"
          link="Manage teams →"
        />
        <OverviewCard
          title="Live Production"
          description="Connect observer tools, killfeed and casting overlays."
          href="/dashboard/live"
          link="Live tools →"
        />
      </div>
    </div>
  );
}

function OverviewCard({
  title,
  description,
  href,
  link,
}: {
  title: string;
  description: string;
  href: string;
  link: string;
}) {
  return (
    <a
      href={href}
      className="block bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-sky-500/60 hover:shadow-xl hover:shadow-sky-900/40 transition"
    >
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <p className="text-sm text-slate-400 mb-4">{description}</p>
      <p className="text-xs text-sky-400">{link}</p>
    </a>
  );
}
