"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function CreateStagePage() {
  const params = useParams();
  const tournamentId = params.id as string;
  const router = useRouter();

  const [name, setName] = useState("");
  const [type, setType] = useState("Group Stage");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/stages/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tournamentId, name, type }),
        }
      );

      if (!res.ok) {
        setError("Failed to create stage.");
        return;
      }

      router.push(`/dashboard/tournaments/${tournamentId}/stages`);
    } catch (err) {
      setError("Network error.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <button
        onClick={() =>
          router.push(`/dashboard/tournaments/${tournamentId}/stages`)
        }
        className="voltrix-card-link"
        style={{ marginBottom: "0.75rem" }}
      >
        ← Back to Stages
      </button>

      <h1 className="voltrix-section-title">Create Stage</h1>
      <p className="voltrix-section-subtitle">
        Add a new competitive stage. Example: “Group Stage”, “Super Weekend”,
        “Grand Finals”.
      </p>

      <div className="voltrix-card" style={{ maxWidth: "480px" }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label className="voltrix-field-label">Stage Name</label>
            <input
              className="voltrix-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Example: Group Stage"
              required
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label className="voltrix-field-label">Format</label>
            <select
              className="voltrix-input"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option>Group Stage</option>
              <option>Super Weekend</option>
              <option>Semifinals</option>
              <option>Finals</option>
            </select>
          </div>

          {error && <p className="voltrix-login-error">{error}</p>}

          <button
            type="submit"
            className="voltrix-login-button"
            disabled={saving}
          >
            {saving ? "Creating…" : "Create Stage"}
          </button>
        </form>
      </div>
    </>
  );
}
