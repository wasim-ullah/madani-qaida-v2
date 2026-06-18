'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { PlanKey } from '@/lib/stripe';

const plans = [
  {
    key:         'monthly' as PlanKey,
    label:       'Monthly',
    price:       '£4.99',
    period:      '/month',
    description: 'Cancel any time',
    highlight:   false,
  },
  {
    key:         'yearly' as PlanKey,
    label:       'Yearly',
    price:       '£39.99',
    period:      '/year',
    description: 'Save 33% vs monthly',
    highlight:   true,
    badge:       'Best value',
  },
];

export default function PricingPage() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState<PlanKey | 'portal' | null>(null);

  // Check if user arrived here because their sub lapsed (subscribed=0 query param)
  const searchParams = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search)
    : null;
  const subscribed = searchParams?.get('subscribed');

  async function subscribe(plan: PlanKey) {
    if (!isSignedIn) { router.push('/sign-in'); return; }
    setLoading(plan);
    try {
      const res  = await fetch('/api/stripe/checkout', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; }
      else { alert('Something went wrong. Please try again.'); setLoading(null); }
    } catch { alert('Network error. Please try again.'); setLoading(null); }
  }

  async function openPortal() {
    setLoading('portal');
    try {
      const res  = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (res.status === 404) {
        alert('No active subscription found on this account. Please subscribe first using the plans above.');
        setLoading(null);
      } else if (res.status === 503) {
        alert('The billing portal is not yet enabled. Please contact support.');
        setLoading(null);
      } else {
        alert(`Could not open billing portal: ${data.error ?? 'Unknown error'}`);
        setLoading(null);
      }
    } catch { alert('Network error. Please try again.'); setLoading(null); }
  }

  return (
    <main className="min-h-screen sky-bg flex flex-col items-center justify-center px-4 py-16 gap-8">

      {/* Success banner */}
      {subscribed === '1' && (
        <div className="bg-green-100 border border-green-300 text-green-800 rounded-2xl px-6 py-3 text-sm font-medium">
          🎉 Subscription active — welcome to Madani Qaida!
        </div>
      )}

      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold text-indigo-900 drop-shadow">
          📖 Madani Qaida
        </h1>
        <p className="text-lg text-indigo-700 max-w-md">
          Learn Quranic Arabic step-by-step with interactive lessons, audio, and progress tracking.
        </p>
        <div className="inline-flex items-center gap-2 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-full px-5 py-2 text-sm font-bold shadow">
          🎁 7-day free trial — no charge until day 8
        </div>
      </div>

      {/* Plan cards */}
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-xl">
        {plans.map((plan) => (
          <div
            key={plan.key}
            className={`relative flex-1 rounded-3xl shadow-xl p-8 flex flex-col gap-4 transition-transform hover:-translate-y-1
              ${plan.highlight
                ? 'bg-indigo-600 text-white ring-4 ring-yellow-300'
                : 'bg-white text-indigo-900'
              }`}
          >
            {plan.badge && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-300 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow">
                {plan.badge}
              </span>
            )}

            <div>
              <p className="text-sm font-semibold uppercase tracking-widest opacity-70">
                {plan.label}
              </p>
              <p className="text-5xl font-extrabold mt-1">
                {plan.price}
                <span className="text-base font-normal opacity-60">{plan.period}</span>
              </p>
              <p className={`text-sm mt-1 ${plan.highlight ? 'text-indigo-200' : 'text-indigo-500'}`}>
                {plan.description}
              </p>
            </div>

            <ul className={`text-sm space-y-1 flex-1 ${plan.highlight ? 'text-indigo-100' : 'text-indigo-700'}`}>
              <li>✓ All 6 lesson tabs</li>
              <li>✓ Audio pronunciation</li>
              <li>✓ Progress tracking</li>
              <li>✓ Teacher mark tools</li>
            </ul>

            <button
              onClick={() => subscribe(plan.key)}
              disabled={loading !== null}
              className={`w-full py-3 rounded-2xl font-bold text-base transition
                ${plan.highlight
                  ? 'bg-white text-indigo-700 hover:bg-indigo-50'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }
                disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {loading === plan.key ? 'Redirecting…' : 'Start Free Trial'}
            </button>
            <p className={`text-center text-xs ${plan.highlight ? 'text-indigo-200' : 'text-indigo-400'}`}>
              7 days free, then {plan.price}{plan.period}
            </p>
          </div>
        ))}
      </div>

      {/* Manage existing subscription */}
      {isSignedIn && (
        <button
          onClick={openPortal}
          disabled={loading !== null}
          className="text-sm text-indigo-500 underline underline-offset-2 hover:text-indigo-700 disabled:opacity-50"
        >
          {loading === 'portal' ? 'Opening…' : 'Manage or cancel existing subscription'}
        </button>
      )}

      <p className="text-xs text-indigo-500 text-center">
        Secure payment via Stripe · Cancel any time · No charge for 7 days
      </p>
    </main>
  );
}
