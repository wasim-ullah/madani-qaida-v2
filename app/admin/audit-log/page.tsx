'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

type Entry = {
  id: number;
  targetUserId: string;
  targetEmail: string | null;
  adminId: string;
  previousStatus: string | null;
  newStatus: string | null;
  reason: string | null;
  createdAt: string;
};

export default function AuditLogPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage]       = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchLog = useCallback(async (p: number) => {
    setLoading(true);
    const res  = await fetch(`/api/admin/audit-log?page=${p}`);
    const data = await res.json();
    setEntries(data.entries ?? []);
    setHasMore((data.entries?.length ?? 0) === data.pageSize);
    setLoading(false);
  }, []);

  useEffect(() => { fetchLog(page); }, [fetchLog, page]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-100">Audit Log</h1>

      <div className="overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 text-slate-400 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">When</th>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Change</th>
              <th className="px-4 py-3 text-left">Reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500">Loading…</td></tr>
            )}
            {!loading && entries.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500">No audit entries yet.</td></tr>
            )}
            {entries.map(e => (
              <tr key={e.id} className="bg-slate-950 hover:bg-slate-900 transition">
                <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                  {new Date(e.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/users/${e.targetUserId}`} className="text-indigo-400 hover:text-indigo-300 text-xs transition">
                    {e.targetEmail ?? e.targetUserId}
                  </Link>
                </td>
                <td className="px-4 py-3 text-xs">
                  <span className="text-slate-500">{e.previousStatus ?? 'none'}</span>
                  <span className="text-slate-600 mx-1">→</span>
                  <span className={`font-medium ${
                    e.newStatus === 'granted' ? 'text-emerald-400' :
                    e.newStatus === 'revoked' ? 'text-red-400' :
                    'text-slate-400'
                  }`}>{e.newStatus ?? 'cleared'}</span>
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs">{e.reason ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
  );
}
