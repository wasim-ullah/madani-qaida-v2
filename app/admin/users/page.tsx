'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type UserRow = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
  subStatus: string | null;
  subEnd: string | null;
  overrideStatus: string | null;
};

const STATUS_COLORS: Record<string, string> = {
  active:     'bg-green-900 text-green-300',
  trialing:   'bg-blue-900 text-blue-300',
  past_due:   'bg-yellow-900 text-yellow-300',
  canceled:   'bg-slate-700 text-slate-400',
  incomplete: 'bg-orange-900 text-orange-300',
};

const OVERRIDE_COLORS: Record<string, string> = {
  granted: 'bg-emerald-900 text-emerald-300',
  revoked:  'bg-red-900 text-red-300',
};

export default function AdminUsersPage() {
  const searchParams = useSearchParams();

  const [rows, setRows]         = useState<UserRow[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState(searchParams.get('search') ?? '');
  const [page, setPage]         = useState(parseInt(searchParams.get('page') ?? '1', 10));
  const [hasMore, setHasMore]   = useState(false);

  // Quick-grant state
  const [grantEmail, setGrantEmail]   = useState('');
  const [grantReason, setGrantReason] = useState('');
  const [granting, setGranting]       = useState(false);
  const [grantMsg, setGrantMsg]       = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const fetchUsers = useCallback(async (q: string, p: number) => {
    setLoading(true);
    const res = await fetch(`/api/admin/users?search=${encodeURIComponent(q)}&page=${p}`);
    const data = await res.json();
    setRows(data.users ?? []);
    setHasMore((data.users?.length ?? 0) === data.pageSize);
    setLoading(false);
  }, []);

  useEffect(() => { fetchUsers(search, page); }, [fetchUsers, search, page]);

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const val = (e.currentTarget.elements.namedItem('q') as HTMLInputElement).value;
    setSearch(val);
    setPage(1);
  }

  async function quickGrant(e: React.FormEvent) {
    e.preventDefault();
    if (!grantEmail.trim()) return;
    setGranting(true);
    setGrantMsg(null);

    // Find user by email (search API)
    const res  = await fetch(`/api/admin/users?search=${encodeURIComponent(grantEmail.trim())}&page=1`);
    const data = await res.json();
    const match = (data.users as UserRow[])?.find(
      u => u.email.toLowerCase() === grantEmail.trim().toLowerCase()
    );

    if (!match) {
      setGrantMsg({ type: 'err', text: `No user found with email "${grantEmail.trim()}". They must sign up first.` });
      setGranting(false);
      return;
    }

    const overrideRes = await fetch(`/api/admin/users/${match.id}/override`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ status: 'granted', reason: grantReason || 'Admin grant' }),
    });

    if (overrideRes.ok) {
      setGrantMsg({ type: 'ok', text: `✓ Access granted to ${match.email}` });
      setGrantEmail('');
      setGrantReason('');
      fetchUsers(search, page); // refresh table
    } else {
      setGrantMsg({ type: 'err', text: 'Something went wrong. Please try again.' });
    }
    setGranting(false);
  }

  async function quickRevoke(userId: string, email: string) {
    if (!confirm(`Revoke access for ${email}?`)) return;
    await fetch(`/api/admin/users/${userId}/override`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ status: 'revoked', reason: 'Admin revoke' }),
    });
    fetchUsers(search, page);
  }

  async function clearOverride(userId: string) {
    await fetch(`/api/admin/users/${userId}/override`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ status: null }),
    });
    fetchUsers(search, page);
  }

  return (
    <div className="space-y-8">

      {/* ── Quick Grant Access ── */}
      <section className="bg-slate-900 rounded-2xl p-6 border border-emerald-800/50">
        <h2 className="text-base font-bold text-emerald-400 mb-1">✓ Grant Free Access</h2>
        <p className="text-xs text-slate-500 mb-4">
          Allow someone to use the app without a subscription. They must already have an account.
        </p>
        <form onSubmit={quickGrant} className="flex flex-col gap-3">
          <div className="flex gap-3 flex-wrap">
            <input
              type="email"
              value={grantEmail}
              onChange={e => setGrantEmail(e.target.value)}
              placeholder="user@example.com"
              required
              className="flex-1 min-w-48 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="text"
              value={grantReason}
              onChange={e => setGrantReason(e.target.value)}
              placeholder="Reason (optional) — e.g. scholarship"
              className="flex-1 min-w-48 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={granting}
              className="bg-emerald-700 hover:bg-emerald-600 text-white px-6 py-2 rounded-xl text-sm font-bold disabled:opacity-50 transition whitespace-nowrap"
            >
              {granting ? 'Granting…' : 'Grant Access'}
            </button>
          </div>
          {grantMsg && (
            <p className={`text-sm px-3 py-2 rounded-xl ${
              grantMsg.type === 'ok'
                ? 'bg-emerald-900/50 text-emerald-300'
                : 'bg-red-900/50 text-red-300'
            }`}>
              {grantMsg.text}
            </p>
          )}
        </form>
      </section>

      {/* ── Users Table ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-100">Users</h1>
          <span className="text-sm text-slate-500">{rows.length} shown</span>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            name="q"
            defaultValue={search}
            placeholder="Search by name or email…"
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-medium transition"
          >
            Search
          </button>
        </form>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-sm">
            <thead className="bg-slate-900 text-slate-400 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Subscription</th>
                <th className="px-4 py-3 text-left">Override</th>
                <th className="px-4 py-3 text-left">Joined</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">Loading…</td></tr>
              )}
              {!loading && rows.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">No users found.</td></tr>
              )}
              {rows.map((u) => (
                <tr key={u.id} className="bg-slate-950 hover:bg-slate-900 transition">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-100">{u.name ?? '—'}</p>
                    <p className="text-slate-500 text-xs">{u.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                      ${u.role === 'admin'   ? 'bg-purple-900 text-purple-300' :
                        u.role === 'teacher' ? 'bg-blue-900 text-blue-300' :
                        'bg-slate-800 text-slate-400'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {u.subStatus ? (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[u.subStatus] ?? 'bg-slate-800 text-slate-400'}`}>
                        {u.subStatus}
                      </span>
                    ) : <span className="text-slate-600 text-xs">none</span>}
                  </td>
                  <td className="px-4 py-3">
                    {u.overrideStatus ? (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${OVERRIDE_COLORS[u.overrideStatus] ?? ''}`}>
                        {u.overrideStatus}
                      </span>
                    ) : <span className="text-slate-600 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Grant / revoke / clear inline */}
                      {u.overrideStatus !== 'granted' && (
                        <button
                          onClick={async () => {
                            await fetch(`/api/admin/users/${u.id}/override`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ status: 'granted', reason: 'Admin grant' }),
                            });
                            fetchUsers(search, page);
                          }}
                          className="text-xs px-2 py-1 rounded-lg bg-emerald-900/60 text-emerald-300 hover:bg-emerald-800 transition"
                        >
                          ✓ Grant
                        </button>
                      )}
                      {u.overrideStatus !== 'revoked' && (
                        <button
                          onClick={() => quickRevoke(u.id, u.email)}
                          className="text-xs px-2 py-1 rounded-lg bg-red-900/60 text-red-300 hover:bg-red-800 transition"
                        >
                          ✗ Revoke
                        </button>
                      )}
                      {u.overrideStatus && (
                        <button
                          onClick={() => clearOverride(u.id)}
                          className="text-xs px-2 py-1 rounded-lg bg-slate-700 text-slate-400 hover:bg-slate-600 transition"
                        >
                          Clear
                        </button>
                      )}
                      <Link
                        href={`/admin/users/${u.id}`}
                        className="text-xs px-2 py-1 rounded-lg bg-slate-800 text-indigo-400 hover:bg-slate-700 transition"
                      >
                        Detail →
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex gap-3 justify-end text-sm">
          <button
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition"
          >
            ← Prev
          </button>
          <span className="px-4 py-2 text-slate-500">Page {page}</span>
          <button
            disabled={!hasMore}
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
