'use client';

import { useState } from 'react';
import PricingTiers from '@/components/PricingTiers';
import EligibilityChecker from '@/components/EligibilityChecker';
import ComparisonCharts from '@/components/ComparisonCharts';
import RepaymentSchedule from '@/components/RepaymentSchedule';

interface LoanData {
  amount: number;
  tenure: number;
  interestRate: number;
}

export default function PriceLevelsPage() {
  const [loanData, setLoanData] = useState<LoanData>({
    amount: 500000,
    tenure: 12,
    interestRate: 12,
  });

  const [eligibilityResult, setEligibilityResult] = useState<{
    eligible: boolean;
    tier: string;
  } | null>(null);

  const handleEligibilityCheck = (result: {
    eligible: boolean;
    tier: string;
  }) => {
    setEligibilityResult(result);
  };

  const handleLoanUpdate = (data: Partial<LoanData>) => {
    setLoanData((prev) => ({ ...prev, ...data }));
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-secondary">
      {/* Header */}
      <section className="border-b border-secondary bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <h1 className="heading-lg mb-2">Loan Pricing & Eligibility</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Explore our transparent pricing tiers, check your eligibility, and see real-time repayment
            calculations tailored to your financial profile.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Left Sidebar - Eligibility & Input */}
          <div className="lg:col-span-1">
            <EligibilityChecker
              onCheckEligibility={handleEligibilityCheck}
              onLoanDataChange={handleLoanUpdate}
              currentLoanData={loanData}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-12">
            {/* Pricing Tiers */}
            <section>
              <h2 className="heading-md mb-6">Available Pricing Tiers</h2>
              <PricingTiers currentTier={eligibilityResult?.tier} />
            </section>

            {/* Charts and Visualizations */}
            <section>
              <h2 className="heading-md mb-6">Interest Rate Comparison</h2>
              <ComparisonCharts loanAmount={loanData.amount} />
            </section>

            {/* Repayment Schedule */}
            {eligibilityResult && (
              <section>
                <h2 className="heading-md mb-6">Your Repayment Schedule</h2>
                <RepaymentSchedule loanData={loanData} />
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
