"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { Player, Team } from "@/lib/types";

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teamsById, setTeamsById] = useState<Record<number, Team>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [playersData, teamsData] = await Promise.all([
          apiGet("/players"),
          apiGet("/teams"),
        ]);

        setPlayers(playersData);
        const map: Record<number, Team> = {};
        teamsData.forEach((t: Team) => (map[t.id] = t));
        setTeamsById(map);
      } catch {
        setError("Failed to load players");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">Players</h1>
      <p className="text-sm text-slate-400 mb-6">
        Player IDs, IGNs and flags ready for overlays and killfeed.
      </p>

      {loading && <p>Loading…</p>}
      {error && <p className="text-red-400">{error}</p>}
      {!loading && players.length === 0 && (
        <p className="text-slate-400">No players yet.</p>
      )}

      {players.length > 0 && (
        <div className="border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-900/80 text-slate-300">
              <tr>
                <th className="px-4 py-2 text-left border-b border-slate-800">
                  IGN
                </th>
                <th className="px-4 py-2 text-left border-b border-slate-800">
                  PUBG ID
                </th>
                <th className="px-4 py-2 text-left border-b border-slate-800">
                  TEAM
                </th>
                <th className="px-4 py-2 text-left border-b border-slate-800">
                  COUNTRY
                </th>
              </tr>
            </thead>
            <tbody>
              {players.map((p) => {
                const team = p.teamId ? teamsById[p.teamId] : null;
                return (
                  <tr key={p.id} className="hover:bg-slate-900/60">
                    <td className="px-4 py-2 border-b border-slate-800">
                      {p.ign}
                    </td>
                    <td className="px-4 py-2 border-b border-slate-800">
                      {p.pubgId}
                    </td>
                    <td className="px-4 py-2 border-b border-slate-800">
                      {team ? team.tag : "-"}
                    </td>
                    <td className="px-4 py-2 border-b border-slate-800">
                      {p.country ?? "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
