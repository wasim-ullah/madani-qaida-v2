'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Sub = {
  id: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  status: string;
  currentPeriodEnd: string;
  createdAt: string;
};

type AuditEntry = {
  id: number;
  adminId: string;
  previousStatus: string | null;
  newStatus: string | null;
  reason: string | null;
  createdAt: string;
};

type UserDetail = {
  user: { id: string; email: string; name: string | null; role: string; createdAt: string };
  subscriptions: Sub[];
  override: { overrideStatus: string | null; reason: string | null } | null;
  audit: AuditEntry[];
};

const STATUS_PILL: Record<string, string> = {
  active:   'bg-green-900 text-green-300',
  trialing: 'bg-blue-900 text-blue-300',
  past_due: 'bg-yellow-900 text-yellow-300',
  canceled: 'bg-slate-700 text-slate-400',
};

export default function UserDetailPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params);
  const router = useRouter();

  const [data, setData]       = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [reason, setReason]   = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/admin/users/${userId}`);
    const d = await res.json();
    setData(d);
    setSelectedRole(d.user?.role ?? 'student');
    setReason(d.override?.reason ?? '');
    setLoading(false);
  }

  useEffect(() => { load(); }, [userId]);

  async function setOverride(status: 'granted' | 'revoked' | null) {
    setSaving(true);
    await fetch(`/api/admin/users/${userId}/override`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, reason: reason || undefined }),
    });
    await load();
    setSaving(false);
  }

  async function updateRole() {
    setSaving(true);
    await fetch(`/api/admin/users/${userId}/role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: selectedRole }),
    });
    await load();
    setSaving(false);
  }

  if (loading) {
    return <div className="text-slate-400 py-20 text-center">Loading…</div>;
  }
  if (!data) {
    return <div className="text-red-400 py-20 text-center">User not found.</div>;
  }

  const { user, subscriptions, override, audit } = data;
  const currentOverride = override?.overrideStatus ?? null;

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Back */}
      <button onClick={() => router.back()} className="text-sm text-slate-500 hover:text-slate-300 transition">
        ← Back to users
      </button>

      {/* Profile card */}
      <section className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-1">
        <h1 className="text-xl font-bold text-slate-100">{user.name ?? '(no name)'}</h1>
        <p className="text-slate-400 text-sm">{user.email}</p>
        <p className="text-slate-500 text-xs">
          ID: <span className="font-mono">{user.id}</span>
        </p>
        <p className="text-slate-500 text-xs">
          Joined {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </section>

      {/* Role */}
      <section className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Role</h2>
        <div className="flex gap-3 items-center flex-wrap">
          <select
            value={selectedRole}
            onChange={e => setSelectedRole(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="student">student</option>
            <option value="teacher">teacher</option>
            <option value="admin">admin</option>
          </select>
          <button
            onClick={updateRole}
            disabled={saving || selectedRole === user.role}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-50 transition"
          >
            {saving ? 'Saving…' : 'Update role'}
          </button>
          <span className="text-slate-500 text-xs">Current: <strong className="text-slate-300">{user.role}</strong></span>
        </div>
      </section>

      {/* Access override */}
      <section className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Access Override</h2>

        <div className="flex items-center gap-3 text-sm">
          <span className="text-slate-400">Current:</span>
          {currentOverride ? (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium
              ${currentOverride === 'granted' ? 'bg-emerald-900 text-emerald-300' : 'bg-red-900 text-red-300'}`}>
              {currentOverride}
            </span>
          ) : (
            <span className="text-slate-600 text-xs">none — using Stripe status</span>
          )}
        </div>

        <div>
          <label className="block text-xs text-slate-500 mb-1">Reason (optional)</label>
          <input
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="e.g. scholarship, staff member…"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setOverride('granted')}
            disabled={saving}
            className="bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-50 transition"
          >
            ✓ Grant access
          </button>
          <button
            onClick={() => setOverride('revoked')}
            disabled={saving}
            className="bg-red-800 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-50 transition"
          >
            ✗ Revoke access
          </button>
          {currentOverride && (
            <button
              onClick={() => setOverride(null)}
              disabled={saving}
              className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-50 transition"
            >
              Clear override
            </button>
          )}
        </div>
      </section>

      {/* Subscriptions */}
      <section className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Subscriptions</h2>
        {subscriptions.length === 0 ? (
          <p className="text-slate-600 text-sm">No subscriptions on record.</p>
        ) : (
          <div className="space-y-3">
            {subscriptions.map(s => (
              <div key={s.id} className="flex gap-4 items-start text-sm border border-slate-800 rounded-xl p-3 bg-slate-950">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_PILL[s.status] ?? 'bg-slate-700 text-slate-400'}`}>
                  {s.status}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-slate-400 text-xs truncate">{s.stripeSubscriptionId}</p>
                  <p className="text-slate-500 text-xs">
                    Renews {new Date(s.currentPeriodEnd).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Audit log */}
      <section className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Override Audit Log</h2>
        {audit.length === 0 ? (
          <p className="text-slate-600 text-sm">No changes recorded.</p>
        ) : (
          <div className="space-y-2 text-xs">
            {audit.map(a => (
              <div key={a.id} className="flex gap-3 border border-slate-800 rounded-xl p-3 bg-slate-950">
                <span className="text-slate-600 whitespace-nowrap">{new Date(a.createdAt).toLocaleString()}</span>
                <span className="text-slate-400">
                  {a.previousStatus ?? 'none'} → <strong className="text-slate-200">{a.newStatus ?? 'none'}</strong>
                  {a.reason ? ` — ${a.reason}` : ''}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
