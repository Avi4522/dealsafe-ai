export type BillingCycle = 'monthly' | 'annual';
export type Currency = 'USD' | 'INR';

export type PlanId = 'free' | 'pro' | 'business';

export interface PlanDefinition {
  id: PlanId;
  planName: string;
  displayName: string;
  tagline: string;
  highlighted: boolean;
  monthlyUsd: number;
  annualMonthlyUsd: number;
  monthlyInr: number;
  annualMonthlyInr: number;
  analysesPerMonth: number | 'limited';
  included: string[];
  excluded: string[];
}

/** PRD section 10 — do not invent prices. Annual display is 20% off the monthly rate. */
export const PLANS: PlanDefinition[] = [
  {
    id: 'free',
    planName: 'Free Plan',
    displayName: 'Free',
    tagline: 'Limited analysis to understand a contract before you sign.',
    highlighted: false,
    monthlyUsd: 0,
    annualMonthlyUsd: 0,
    monthlyInr: 0,
    annualMonthlyInr: 0,
    analysesPerMonth: 'limited',
    included: [
      'Limited document analysis',
      'Basic risk summary',
      'Limited clause explanations',
      'Watermarked report',
      '3 free analyses to start',
    ],
    excluded: ['Contract Copilot', 'Contract comparison', 'Team collaboration'],
  },
  {
    id: 'pro',
    planName: 'Pro Plan',
    displayName: 'Pro',
    tagline: 'Full risk reports, Copilot, and history for growing teams.',
    highlighted: true,
    monthlyUsd: 29,
    annualMonthlyUsd: 23,
    monthlyInr: 999,
    annualMonthlyInr: 799,
    analysesPerMonth: 10,
    included: [
      '10 full analyses monthly',
      'Detailed risk reports',
      'PDF annotations',
      'Contract Copilot',
      'Negotiation suggestions',
      'Contract history',
      'Limited contract comparisons',
    ],
    excluded: [],
  },
  {
    id: 'business',
    planName: 'Business Plan',
    displayName: 'Business',
    tagline: 'Vault, generator, and team collaboration for SMEs.',
    highlighted: false,
    monthlyUsd: 79,
    annualMonthlyUsd: 63,
    monthlyInr: 2999,
    annualMonthlyInr: 2399,
    analysesPerMonth: 40,
    included: [
      '40 analyses monthly',
      'Everything in Pro',
      'Contract comparison',
      'Contract Vault',
      'Obligation tracking',
      'Contract generator',
      'Team collaboration',
      'Custom playbooks',
    ],
    excluded: [],
  },
];

export const USAGE_CREDITS: Record<string, number> = {
  free: 3,
  pro: 10,
  enterprise: 40,
  business: 40,
};

export function displayPrice(plan: PlanDefinition, cycle: BillingCycle, currency: Currency) {
  if (currency === 'INR') {
    const value = cycle === 'annual' ? plan.annualMonthlyInr : plan.monthlyInr;
    return { symbol: '₹', value, suffix: '/month' };
  }
  const value = cycle === 'annual' ? plan.annualMonthlyUsd : plan.monthlyUsd;
  return { symbol: '$', value, suffix: '/month' };
}

export function stripeAmountCents(planName: string, cycle: BillingCycle): number | null {
  if (planName === 'Pro Plan') return cycle === 'annual' ? 27840 : 2900;
  if (planName === 'Business Plan' || planName === 'Enterprise Plan') {
    return cycle === 'annual' ? 75840 : 7900;
  }
  return null;
}

export function razorpayAmountPaise(planName: string, cycle: BillingCycle): number | null {
  if (planName === 'Pro Plan') return cycle === 'annual' ? 958800 : 99900;
  if (planName === 'Business Plan' || planName === 'Enterprise Plan') {
    return cycle === 'annual' ? 2878800 : 299900;
  }
  return null;
}

export function tierFromPlanName(planName: string): 'free' | 'pro' | 'enterprise' {
  if (planName === 'Business Plan' || planName === 'Enterprise Plan') return 'enterprise';
  if (planName === 'Pro Plan') return 'pro';
  return 'free';
}
