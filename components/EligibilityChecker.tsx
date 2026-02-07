'use client';

import { useState } from 'react';
import { Check, AlertCircle } from 'lucide-react';

interface EligibilityCheckerProps {
  onCheckEligibility: (result: { eligible: boolean; tier: string }) => void;
  onLoanDataChange: (data: {
    amount?: number;
    tenure?: number;
    interestRate?: number;
  }) => void;
  currentLoanData: {
    amount: number;
    tenure: number;
    interestRate: number;
  };
}

const SALARY_TIERS = [
  { min: 300000, max: 600000, name: 'Bronze', rate: 14 },
  { min: 600001, max: 1500000, name: 'Silver', rate: 12 },
  { min: 1500001, max: 3000000, name: 'Gold', rate: 10 },
  { min: 3000001, max: Infinity, name: 'Platinum', rate: 8 },
];

export default function EligibilityChecker({
  onCheckEligibility,
  onLoanDataChange,
  currentLoanData,
}: EligibilityCheckerProps) {
  const [salary, setSalary] = useState(750000);
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState<{ eligible: boolean; tier: string } | null>(null);

  const checkEligibility = () => {
    const tier = SALARY_TIERS.find((t) => salary >= t.min && salary <= t.max);
    const eligible = !!tier && currentLoanData.amount <= salary * 5;

    const eligibilityResult = {
      eligible,
      tier: tier?.name || 'Bronze',
    };

    setResult(eligibilityResult);
    setChecked(true);
    onCheckEligibility(eligibilityResult);

    // Auto-update interest rate based on tier
    onLoanDataChange({
      interestRate: tier?.rate || 14,
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Salary Input */}
      <div className="card">
        <h3 className="heading-sm mb-4">Annual Salary</h3>
        <div className="mb-4">
          <input
            type="range"
            min="300000"
            max="5000000"
            step="50000"
            value={salary}
            onChange={(e) => setSalary(Number(e.target.value))}
            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-primary mb-1">{formatCurrency(salary)}</p>
          <p className="text-sm text-muted-foreground">Drag to adjust your salary</p>
        </div>
      </div>

      {/* Loan Amount Input */}
      <div className="card">
        <h3 className="heading-sm mb-4">Loan Amount</h3>
        <input
          type="range"
          min="100000"
          max="5000000"
          step="50000"
          value={currentLoanData.amount}
          onChange={(e) =>
            onLoanDataChange({
              amount: Number(e.target.value),
            })
          }
          className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary mb-4"
        />
        <p className="text-2xl font-bold text-primary">{formatCurrency(currentLoanData.amount)}</p>
      </div>

      {/* Tenure Input */}
      <div className="card">
        <h3 className="heading-sm mb-4">Loan Tenure</h3>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[6, 12, 24, 36].map((months) => (
            <button
              key={months}
              onClick={() =>
                onLoanDataChange({
                  tenure: months,
                })
              }
              className={`py-2 rounded-lg font-semibold transition-colors ${
                currentLoanData.tenure === months
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-foreground hover:bg-muted'
              }`}
            >
              {months}M
            </button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground text-center">Selected: {currentLoanData.tenure} months</p>
      </div>

      {/* Check Eligibility Button */}
      <button
        onClick={checkEligibility}
        className="w-full btn-primary bg-accent hover:opacity-80"
      >
        Check Eligibility
      </button>

      {/* Result Display */}
      {checked && result && (
        <div
          className={`card border-2 ${
            result.eligible
              ? 'border-green-500 bg-green-50'
              : 'border-red-500 bg-red-50'
          }`}
        >
          <div className="flex items-start gap-3">
            {result.eligible ? (
              <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className={`font-bold mb-1 ${result.eligible ? 'text-green-900' : 'text-red-900'}`}>
                {result.eligible ? 'Eligible' : 'Not Eligible'}
              </p>
              <p className={`text-sm ${result.eligible ? 'text-green-800' : 'text-red-800'}`}>
                {result.eligible
                  ? `You qualify for ${result.tier} tier with ${currentLoanData.interestRate}% interest rate`
                  : 'Loan amount exceeds your eligibility limit'}
              </p>
            </div>
          </div>

          {result.eligible && (
            <div className="mt-4 pt-4 border-t border-green-200">
              <p className="text-xs font-semibold text-green-700 mb-2">LOAN SUMMARY</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-800">Monthly EMI:</span>
                  <span className="font-bold text-green-900">
                    {formatCurrency(
                      (currentLoanData.amount *
                        (currentLoanData.interestRate / 100 / 12) *
                        Math.pow(1 + currentLoanData.interestRate / 100 / 12, currentLoanData.tenure)) /
                        (Math.pow(1 + currentLoanData.interestRate / 100 / 12, currentLoanData.tenure) - 1)
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-800">Total Interest:</span>
                  <span className="font-bold text-green-900">
                    {formatCurrency(
                      (currentLoanData.amount *
                        (currentLoanData.interestRate / 100 / 12) *
                        Math.pow(1 + currentLoanData.interestRate / 100 / 12, currentLoanData.tenure)) /
                        (Math.pow(1 + currentLoanData.interestRate / 100 / 12, currentLoanData.tenure) - 1) *
                        currentLoanData.tenure -
                        currentLoanData.amount
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
