"use client";

export default function LiveProductionPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">Live Production</h1>
      <p className="text-sm text-slate-400 mb-6">
        Connect observer tools, killfeed and casting overlays from one panel.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <LiveCard title="Observer Overlay" description="Coming soon…" />
        <LiveCard title="Killfeed Controller" description="Coming soon…" />
        <LiveCard title="Scorebug & Lower Thirds" description="Coming soon…" />
        <LiveCard title="WebSocket Status" description="Live server: ws://localhost:4000" />
      </div>
    </div>
  );
}

function LiveCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
      <h2 className="text-lg font-semibold mb-1">{title}</h2>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  );
}
