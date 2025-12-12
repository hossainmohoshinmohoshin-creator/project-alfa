"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { Team } from "@/lib/types";

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await apiGet("/teams");
        setTeams(data);
      } catch {
        setError("Failed to load teams");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">Teams & Players</h1>
      <p className="text-sm text-slate-400 mb-6">
        Global Voltrix teams list. Later this connects to /teams and /players
        endpoints for full management.
      </p>

      {loading && <p>Loading…</p>}
      {error && <p className="text-red-400">{error}</p>}
      {!loading && teams.length === 0 && (
        <p className="text-slate-400">No teams yet.</p>
      )}

      {teams.length > 0 && (
        <div className="border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-900/80 text-slate-300">
              <tr>
                <th className="px-4 py-2 text-left border-b border-slate-800">
                  TAG
                </th>
                <th className="px-4 py-2 text-left border-b border-slate-800">
                  NAME
                </th>
                <th className="px-4 py-2 text-left border-b border-slate-800">
                  COUNTRY
                </th>
              </tr>
            </thead>
            <tbody>
              {teams.map((t) => (
                <tr key={t.id} className="hover:bg-slate-900/60">
                  <td className="px-4 py-2 border-b border-slate-800">
                    {t.tag}
                  </td>
                  <td className="px-4 py-2 border-b border-slate-800">
                    {t.name}
                  </td>
                  <td className="px-4 py-2 border-b border-slate-800">
                    {t.country ?? "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
