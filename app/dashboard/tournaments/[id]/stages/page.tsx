"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Stage = {
  id: string;
  name: string;
  type?: string;
  createdAt?: string;
};

export default function StageListPage() {
  const params = useParams();
  const tournamentId = params.id as string;

  const [stages, setStages] = useState<Stage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/stages?tournamentId=${tournamentId}`
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        setStages(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Failed to load stages.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [tournamentId]);

  return (
    <>
      <Link
        href={`/dashboard/tournaments/${tournamentId}`}
        className="voltrix-card-link"
      >
        ← Back to tournament
      </Link>

      <h1 className="voltrix-section-title">Stages</h1>
      <p className="voltrix-section-subtitle">
        Configure stage formats such as Group Stage, Super Weekend, Semifinals,
        and Finals.
      </p>

      <div style={{ marginBottom: "1rem", textAlign: "right" }}>
        <Link
          href={`/dashboard/tournaments/${tournamentId}/stages/create`}
          className="voltrix-card-link"
          style={{
            padding: "0.5rem 1.1rem",
            borderRadius: "999px",
            border: "1px solid rgba(37,99,235,0.7)",
            background:
              "linear-gradient(90deg, rgba(37,99,235,0.18), rgba(56,189,248,0.18))",
            fontWeight: 600,
          }}
        >
          + Create Stage
        </Link>
      </div>

      <div className="voltrix-card">
        {loading ? (
          <p className="voltrix-card-text">Loading stages…</p>
        ) : error ? (
          <p className="voltrix-login-error">{error}</p>
        ) : (
          <table className="voltrix-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Format</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {stages.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.type || "Standard"}</td>
                  <td>{s.createdAt?.split("T")[0]}</td>
                </tr>
              ))}
              {stages.length === 0 && (
                <tr>
                  <td colSpan={3}>No stages created yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
