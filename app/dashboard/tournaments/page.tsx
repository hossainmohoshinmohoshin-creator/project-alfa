// example: app/dashboard/tournaments/page.tsx
"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import Link from "next/link";

interface Tournament {
  id: number;
  name: string;
  timezone: string;
  formatType: string;
}

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await apiGet("/tournaments");
        setTournaments(data);
      } catch (e) {
        console.error(e);
        setError("Failed to load tournaments");
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="voltrix-page-header">
        <h1 className="voltrix-page-title">Tournaments</h1>
        <p className="voltrix-page-subtitle">
          Manage PUBG Mobile tournaments and connect them to stages, groups and matches.
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div />
        <Link
          href="/dashboard/tournaments/create"
          className="inline-flex items-center rounded-md bg-sky-600 px-4 py-1.5 text-sm font-medium text-white shadow-md hover:bg-sky-500"
        >
          + Create Tournament
        </Link>
      </div>

      {/* Content card */}
      <div className="voltrix-page-card">
        {error && (
          <p className="mb-3 text-sm text-red-400">
            {error}
          </p>
        )}

        {tournaments.length === 0 ? (
          <p className="text-sm text-slate-400">
            No tournaments found yet.
          </p>
        ) : (
          <table className="voltrix-table">
            <thead>
              <tr>
                <th className="text-left">Name</th>
                <th className="text-left">Timezone</th>
                <th className="text-left">Format</th>
              </tr>
            </thead>
            <tbody>
              {tournaments.map((t) => (
                <tr key={t.id}>
                  <td>
                    <Link
                      href={`/dashboard/tournaments/${t.id}`}
                      className="text-sky-300 hover:text-sky-200"
                    >
                      {t.name}
                    </Link>
                  </td>
                  <td>{t.timezone}</td>
                  <td>{t.formatType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
