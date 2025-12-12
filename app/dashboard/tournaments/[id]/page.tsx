"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { apiGet, apiPost } from "@/lib/api";

type Tournament = {
  id: number;
  name: string;
  timezone?: string;
  formatType?: string;
  description?: string | null;
  prizePool?: string | null;
  bannerUrl?: string | null;
  createdAt?: string;
};

type Stage = {
  id: number;
  name: string;
  order: number;
  tournamentId: number;
};

type Group = {
  id: number;
  name: string;
  code?: string;
  stageId: number;
};

type Match = {
  id: number;
  name: string;
  map?: string;
  number?: number;
  groupId: number;
};

type TabKey = "overview" | "stages" | "groups" | "matches";

export default function TournamentDetailPage() {
  const params = useParams();
  const idParam = params?.id;
  const tournamentId = Number(idParam);

  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [loading, setLoading] = useState(true);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [error, setError] = useState("");

  const [stages, setStages] = useState<Stage[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  // form state
  const [newStageName, setNewStageName] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedStageForGroup, setSelectedStageForGroup] = useState<number | "">("");
  const [newMatchName, setNewMatchName] = useState("");
  const [selectedGroupForMatch, setSelectedGroupForMatch] = useState<number | "">("");

  // ---------- LOAD TOURNAMENT + CHILDREN ----------
  useEffect(() => {
    if (!tournamentId || Number.isNaN(tournamentId)) return;

    async function loadAll() {
      try {
        setLoading(true);
        setError("");

        const [t, stageList, groupList, matchList] = await Promise.all([
          apiGet(`/tournaments/${tournamentId}`),
          // ⬇ adjust these URLs if your backend differs
          apiGet(`/stages/by-tournament/${tournamentId}`),
          apiGet(`/groups/by-tournament/${tournamentId}`),
          apiGet(`/matches/by-tournament/${tournamentId}`),
        ]);

        setTournament(t);
        setStages(stageList);
        setGroups(groupList);
        setMatches(matchList);
      } catch (err) {
        console.error(err);
        setError("Failed to load tournament data.");
      } finally {
        setLoading(false);
      }
    }

    loadAll();
  }, [tournamentId]);

  // ---------- CREATE STAGE ----------
  async function handleCreateStage(e: React.FormEvent) {
    e.preventDefault();
    if (!newStageName.trim()) return;
    try {
      setError("");
      const created = await apiPost("/stages/create", {
        tournamentId,
        name: newStageName.trim(),
      });
      const stage = created.stage ?? created;
      setStages((prev) => [...prev, stage]);
      setNewStageName("");
    } catch (err) {
      console.error(err);
      setError("Failed to create stage.");
    }
  }

  // ---------- CREATE GROUP ----------
  async function handleCreateGroup(e: React.FormEvent) {
    e.preventDefault();
    if (!newGroupName.trim() || !selectedStageForGroup) return;
    try {
      setError("");
      const created = await apiPost("/groups/create", {
        stageId: selectedStageForGroup,
        name: newGroupName.trim(),
      });
      const group = created.group ?? created;
      setGroups((prev) => [...prev, group]);
      setNewGroupName("");
      setSelectedStageForGroup("");
    } catch (err) {
      console.error(err);
      setError("Failed to create group.");
    }
  }

  // ---------- CREATE MATCH ----------
  async function handleCreateMatch(e: React.FormEvent) {
    e.preventDefault();
    if (!newMatchName.trim() || !selectedGroupForMatch) return;
    try {
      setError("");
      const created = await apiPost("/matches/create", {
        groupId: selectedGroupForMatch,
        name: newMatchName.trim(),
      });
      const match = created.match ?? created;
      setMatches((prev) => [...prev, match]);
      setNewMatchName("");
      setSelectedGroupForMatch("");
    } catch (err) {
      console.error(err);
      setError("Failed to create match.");
    }
  }

  // ---------- RENDER HELPERS ----------
  function renderTabs() {
    const tabs: { key: TabKey; label: string }[] = [
      { key: "overview", label: "Overview" },
      { key: "stages", label: "Stages" },
      { key: "groups", label: "Groups" },
      { key: "matches", label: "Matches" },
    ];

    return (
      <div className="mb-4 flex gap-2 border-b border-slate-800/80 text-sm">
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-3 py-2 rounded-t-md transition ${
                isActive
                  ? "bg-slate-900 text-sky-300"
                  : "text-slate-400 hover:text-sky-200 hover:bg-slate-900/50"
              }`}
            >
              {tab.label}
              {isActive && (
                <span className="absolute inset-x-0 -bottom-[1px] h-[2px] bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400" />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  function renderOverview() {
    if (!tournament) return null;

    return (
      <div className="grid gap-6 md:grid-cols-[2fr,1.2fr]">
        <div className="rounded-xl border border-slate-700/70 bg-slate-900/60 p-5 shadow-lg shadow-black/40">
          <h2 className="text-sm font-semibold tracking-wide text-slate-300 mb-3">
            Tournament Info
          </h2>
          <p className="text-2xl font-semibold text-slate-50 mb-1">
            {tournament.name}
          </p>
          <p className="text-sm text-slate-400 mb-4">
            {tournament.description || "No description yet."}
          </p>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs">
            <div>
              <dt className="text-slate-500 uppercase tracking-wide">
                Timezone
              </dt>
              <dd className="text-slate-200">
                {tournament.timezone || "Not set"}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500 uppercase tracking-wide">
                Format
              </dt>
              <dd className="text-slate-200">
                {tournament.formatType || "Not set"}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500 uppercase tracking-wide">
                Prize pool
              </dt>
              <dd className="text-slate-200">
                {tournament.prizePool || "Not set"}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500 uppercase tracking-wide">
                Created
              </dt>
              <dd className="text-slate-200">
                {tournament.createdAt
                  ? new Date(tournament.createdAt).toLocaleString()
                  : "Unknown"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-700/70 bg-slate-900/60 p-4 text-sm">
            <p className="text-slate-300 font-semibold mb-2">
              Quick access
            </p>
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab("stages")}
                className="w-full rounded-lg bg-slate-800/80 px-3 py-2 text-left text-slate-200 hover:bg-sky-600/80 hover:text-white transition"
              >
                Configure stages →
              </button>
              <button
                onClick={() => setActiveTab("groups")}
                className="w-full rounded-lg bg-slate-800/80 px-3 py-2 text-left text-slate-200 hover:bg-sky-600/80 hover:text-white transition"
              >
                Manage groups →
              </button>
              <button
                onClick={() => setActiveTab("matches")}
                className="w-full rounded-lg bg-slate-800/80 px-3 py-2 text-left text-slate-200 hover:bg-sky-600/80 hover:text-white transition"
              >
                Schedule matches →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderStages() {
    return (
      <div className="grid gap-6 md:grid-cols-[1.4fr,1fr]">
        <div className="rounded-xl border border-slate-700/70 bg-slate-900/60 p-5">
          <h2 className="text-sm font-semibold text-slate-300 mb-3">
            Stages ({stages.length})
          </h2>
          {stages.length === 0 ? (
            <p className="text-xs text-slate-500">
              No stages yet. Create the first stage on the right.
            </p>
          ) : (
            <ul className="space-y-2 text-sm">
              {stages
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between rounded-lg border border-slate-700/70 bg-slate-900/80 px-3 py-2"
                  >
                    <div>
                      <p className="font-medium text-slate-100">{s.name}</p>
                      <p className="text-[0.7rem] text-slate-500">
                        Order #{s.order}
                      </p>
                    </div>
                    <span className="text-[0.65rem] text-slate-500 uppercase tracking-wide">
                      ID {s.id}
                    </span>
                  </li>
                ))}
            </ul>
          )}
        </div>

        <form
          onSubmit={handleCreateStage}
          className="rounded-xl border border-slate-700/70 bg-slate-900/60 p-5 text-sm space-y-3"
        >
          <h3 className="font-semibold text-slate-200">Create Stage</h3>
          <p className="text-xs text-slate-500">
            Define high level phases of the tournament (e.g. Qualifiers, League, Finals).
          </p>
          <label className="block text-xs text-slate-400">
            Stage name
            <input
              value={newStageName}
              onChange={(e) => setNewStageName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 outline-none focus:border-sky-500"
              placeholder="League Stage"
            />
          </label>
          <button
            type="submit"
            className="mt-1 w-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 py-2 text-xs font-semibold text-slate-950 shadow-lg shadow-sky-500/25 hover:from-sky-400 hover:to-emerald-400 transition"
          >
            Create Stage
          </button>
        </form>
      </div>
    );
  }

  function renderGroups() {
    return (
      <div className="grid gap-6 md:grid-cols-[1.4fr,1fr]">
        <div className="rounded-xl border border-slate-700/70 bg-slate-900/60 p-5">
          <h2 className="text-sm font-semibold text-slate-300 mb-3">
            Groups ({groups.length})
          </h2>
          {groups.length === 0 ? (
            <p className="text-xs text-slate-500">
              No groups yet. Create a group and attach it to a stage.
            </p>
          ) : (
            <ul className="space-y-2 text-sm">
              {groups.map((g) => {
                const stage = stages.find((s) => s.id === g.stageId);
                return (
                  <li
                    key={g.id}
                    className="flex items-center justify-between rounded-lg border border-slate-700/70 bg-slate-900/80 px-3 py-2"
                  >
                    <div>
                      <p className="font-medium text-slate-100">{g.name}</p>
                      <p className="text-[0.7rem] text-slate-500">
                        Stage: {stage ? stage.name : "Unknown"}
                      </p>
                    </div>
                    <span className="text-[0.65rem] text-slate-500 uppercase tracking-wide">
                      ID {g.id}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <form
          onSubmit={handleCreateGroup}
          className="rounded-xl border border-slate-700/70 bg-slate-900/60 p-5 text-sm space-y-3"
        >
          <h3 className="font-semibold text-slate-200">Create Group</h3>
          <p className="text-xs text-slate-500">
            Attach teams into groups within a specific stage.
          </p>

          <label className="block text-xs text-slate-400">
            Stage
            <select
              value={selectedStageForGroup}
              onChange={(e) =>
                setSelectedStageForGroup(
                  e.target.value ? Number(e.target.value) : ""
                )
              }
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 outline-none focus:border-sky-500"
            >
              <option value="">Select stage...</option>
              {stages
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
            </select>
          </label>

          <label className="block text-xs text-slate-400">
            Group name
            <input
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 outline-none focus:border-sky-500"
              placeholder="Group A"
            />
          </label>

          <button
            type="submit"
            className="mt-1 w-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 py-2 text-xs font-semibold text-slate-950 shadow-lg shadow-sky-500/25 hover:from-sky-400 hover:to-emerald-400 transition"
          >
            Create Group
          </button>
        </form>
      </div>
    );
  }

  function renderMatches() {
    return (
      <div className="grid gap-6 md:grid-cols-[1.4fr,1fr]">
        <div className="rounded-xl border border-slate-700/70 bg-slate-900/60 p-5">
          <h2 className="text-sm font-semibold text-slate-300 mb-3">
            Matches ({matches.length})
          </h2>
          {matches.length === 0 ? (
            <p className="text-xs text-slate-500">
              No matches yet. Create matches and attach them to groups.
            </p>
          ) : (
            <ul className="space-y-2 text-sm">
              {matches.map((m) => {
                const group = groups.find((g) => g.id === m.groupId);
                return (
                  <li
                    key={m.id}
                    className="flex items-center justify-between rounded-lg border border-slate-700/70 bg-slate-900/80 px-3 py-2"
                  >
                    <div>
                      <p className="font-medium text-slate-100">{m.name}</p>
                      <p className="text-[0.7rem] text-slate-500">
                        Group: {group ? group.name : "Unknown"}
                      </p>
                    </div>
                    <span className="text-[0.65rem] text-slate-500 uppercase tracking-wide">
                      ID {m.id}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <form
          onSubmit={handleCreateMatch}
          className="rounded-xl border border-slate-700/70 bg-slate-900/60 p-5 text-sm space-y-3"
        >
          <h3 className="font-semibold text-slate-200">Create Match</h3>
          <p className="text-xs text-slate-500">
            Schedule individual games inside a group.
          </p>

          <label className="block text-xs text-slate-400">
            Group
            <select
              value={selectedGroupForMatch}
              onChange={(e) =>
                setSelectedGroupForMatch(
                  e.target.value ? Number(e.target.value) : ""
                )
              }
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 outline-none focus:border-sky-500"
            >
              <option value="">Select group...</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-xs text-slate-400">
            Match name
            <input
              value={newMatchName}
              onChange={(e) => setNewMatchName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 outline-none focus:border-sky-500"
              placeholder="Match 1 - Erangel"
            />
          </label>

          <button
            type="submit"
            className="mt-1 w-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 py-2 text-xs font-semibold text-slate-950 shadow-lg shadow-sky-500/25 hover:from-sky-400 hover:to-emerald-400 transition"
          >
            Create Match
          </button>
        </form>
      </div>
    );
  }

  // ---------- MAIN RENDER ----------
  if (!tournamentId || Number.isNaN(tournamentId)) {
    return (
      <div className="p-8 text-slate-100">
        <p>Invalid tournament id.</p>
      </div>
    );
  }

  return (
    <div className="px-10 py-8 text-slate-100">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-slate-500">
            PUBG Mobile · Production Panel
          </p>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-wide">
              {tournament?.name || "Tournament"}
            </h1>
            <span className="rounded-full border border-slate-700/80 bg-slate-900/80 px-2 py-[2px] text-[0.6rem] uppercase tracking-wide text-slate-400">
              ID #{tournamentId}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure stages, groups and matches for this tournament.
          </p>
        </div>

        <Link
          href="/dashboard/tournaments"
          className="rounded-full border border-slate-700/80 bg-slate-900/70 px-3 py-1.5 text-xs text-slate-300 hover:border-sky-500 hover:text-sky-200 transition"
        >
          ← Back to tournaments
        </Link>
      </div>

      {renderTabs()}

      {error && (
        <div className="mb-4 rounded-md border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-slate-700/70 bg-slate-900/60 px-6 py-10 text-center text-sm text-slate-400">
          Loading tournament…
        </div>
      ) : !tournament ? (
        <div className="rounded-xl border border-slate-700/70 bg-slate-900/60 px-6 py-10 text-center text-sm text-red-300">
          Tournament not found.
        </div>
      ) : (
        <>
          {activeTab === "overview" && renderOverview()}
          {activeTab === "stages" && renderStages()}
          {activeTab === "groups" && renderGroups()}
          {activeTab === "matches" && renderMatches()}
        </>
      )}
    </div>
  );
}
