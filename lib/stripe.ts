/**
 * Singleton Stripe server client + shared constants.
 * Import `stripe` for server-side API calls.
 * Import PLANS for price IDs / display info.
 */
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
  typescript: true,
});

export const PLANS = {
  monthly: {
    priceId:     process.env.STRIPE_PRICE_MONTHLY!,
    label:       'Monthly',
    amount:      '£4.99',
    interval:    'month' as const,
    description: 'Billed monthly — cancel any time',
  },
  yearly: {
    priceId:     process.env.STRIPE_PRICE_YEARLY!,
    label:       'Yearly',
    amount:      '£39.99',
    interval:    'year' as const,
    description: 'Save 33% — billed once a year',
  },
} as const;

export type PlanKey = keyof typeof PLANS;
