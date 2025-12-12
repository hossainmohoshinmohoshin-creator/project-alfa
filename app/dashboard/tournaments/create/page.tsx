"use client";

import { useState } from "react";
import { apiPost } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function CreateTournamentPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  const [formatType, setFormatType] = useState("Squad");
  const [error, setError] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      await apiPost("/tournaments/create", {
        name,
        timezone,
        formatType,
      });

      router.push("/dashboard/tournaments");
    } catch (err) {
      console.error(err);
      setError("Failed to create tournament.");
    }
  }

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-semibold mb-6">Create Tournament</h1>

      <form onSubmit={handleCreate} className="space-y-4">
        <div>
          <label className="text-sm">Tournament Name</label>
          <input
            className="w-full p-2 rounded bg-slate-900 text-white border border-slate-700"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-sm">Timezone</label>
          <input
            className="w-full p-2 rounded bg-slate-900 text-white border border-slate-700"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-sm">Format Type</label>
          <select
            className="w-full p-2 rounded bg-slate-900 text-white border border-slate-700"
            value={formatType}
            onChange={(e) => setFormatType(e.target.value)}
          >
            <option>Squad</option>
            <option>Duo</option>
            <option>Solo</option>
          </select>
        </div>

        {error && <p className="text-red-400">{error}</p>}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 p-2 rounded font-semibold mt-3"
        >
          Create Tournament
        </button>
      </form>
    </div>
  );
}
