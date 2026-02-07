'use client';

import { Check } from 'lucide-react';

interface PricingTiersProps {
  currentTier?: string;
}

const TIERS = [
  {
    name: 'Bronze',
    minSalary: 300000,
    maxSalary: 600000,
    interestRate: 14,
    maxLoan: 3000000,
    features: [
      'Up to ₹30 lakh loan amount',
      '14% fixed interest rate',
      '6-36 months tenure options',
      'Instant approval process',
      'Flexible repayment schedule',
    ],
  },
  {
    name: 'Silver',
    minSalary: 600001,
    maxSalary: 1500000,
    interestRate: 12,
    maxLoan: 7500000,
    features: [
      'Up to ₹75 lakh loan amount',
      '12% fixed interest rate',
      'Extended tenure up to 48 months',
      'Priority customer support',
      'Partial prepayment allowed',
      'Loan top-up available',
    ],
    highlighted: true,
  },
  {
    name: 'Gold',
    minSalary: 1500001,
    maxSalary: 3000000,
    interestRate: 10,
    maxLoan: 15000000,
    features: [
      'Up to ₹1.5 crore loan amount',
      '10% fixed interest rate',
      'Extended tenure up to 60 months',
      '24/7 dedicated relationship manager',
      'Zero prepayment charges',
      'Cashback on on-time payments',
    ],
  },
  {
    name: 'Platinum',
    minSalary: 3000001,
    maxSalary: Infinity,
    interestRate: 8,
    maxLoan: 30000000,
    features: [
      'Up to ₹3 crore loan amount',
      '8% fixed interest rate',
      'Maximum flexibility on tenure',
      'Personal wealth manager',
      'Priority processing',
      'Custom loan structures',
    ],
  },
];

const formatCurrency = (value: number) => {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(1)} Cr`;
  }
  return `₹${(value / 100000).toFixed(1)}L`;
};

export default function PricingTiers({ currentTier }: PricingTiersProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
      {TIERS.map((tier) => {
        const isCurrentTier = tier.name === currentTier;
        return (
          <div
            key={tier.name}
            className={`card relative transition-all ${
              tier.highlighted
                ? 'border-accent border-2 shadow-lg md:col-span-2 lg:col-span-1'
                : 'border-secondary'
            } ${isCurrentTier ? 'ring-2 ring-green-500 ring-offset-2' : ''}`}
          >
            {isCurrentTier && (
              <div className="absolute -top-3 left-6 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                YOUR TIER
              </div>
            )}

            <div className="mb-6">
              <h3 className="heading-sm text-primary mb-2">{tier.name}</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Annual Salary: {formatCurrency(tier.minSalary)} - {tier.maxSalary === Infinity ? '∞' : formatCurrency(tier.maxSalary)}
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-primary">{tier.interestRate}%</span>
                <span className="text-muted-foreground">Interest Rate</span>
              </div>
            </div>

            <div className="mb-6 pb-6 border-b border-secondary">
              <p className="text-sm font-semibold text-muted-foreground mb-3">Max Loan Amount</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(tier.maxLoan)}</p>
            </div>

            <div className="space-y-3">
              {tier.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <button
              className={`w-full mt-6 py-3 rounded-lg font-semibold transition-colors ${
                isCurrentTier
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : tier.highlighted
                    ? 'bg-accent text-white hover:opacity-90'
                    : 'bg-secondary text-foreground hover:bg-muted'
              }`}
            >
              {isCurrentTier ? '✓ Your Eligibility' : 'Explore This Tier'}
            </button>
          </div>
        );
      })}
    </div>
  );
}
