'use client'

import { useState } from 'react'
import Link from 'next/link'
import PricingTiers from '@/components/PricingTiers'
import EligibilityChecker from '@/components/EligibilityChecker'
import ComparisonCharts from '@/components/ComparisonCharts'
import RepaymentSchedule from '@/components/RepaymentSchedule'

interface LoanData {
  amount: number
  tenure: number
  interestRate: number
}

export default function PriceLevelsPage() {
  const [loanData, setLoanData] = useState<LoanData>({
    amount: 500000,
    tenure: 12,
    interestRate: 12,
  })

  const [eligibilityResult, setEligibilityResult] = useState<{
    eligible: boolean
    tier: string
  } | null>(null)

  const handleEligibilityCheck = (result: {
    eligible: boolean
    tier: string
  }) => {
    setEligibilityResult(result)
  }

  const handleLoanUpdate = (data: Partial<LoanData>) => {
    setLoanData((prev) => ({ ...prev, ...data }))
  }

  return (
    <>
      {/* Navigation */}
      <header className="bg-black text-white">
        <nav className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <div className="h-9 w-9 rounded-md bg-white/10 ring-1 ring-white/20 flex items-center justify-center overflow-hidden">
              <img src="/banner.jpg" alt="Finomaa logo" className="h-full w-full object-cover" />
            </div>
            <div className="leading-tight">
              <img src="/headingimage.jpg" alt="Finomaa" className="h-6 w-auto" />
              <span className="block text-xs text-white/70">Quick funds, Brighter tomorrow</span>
            </div>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm text-white/80 hover:text-white transition">Back to Home</Link>
            <a href="https://wa.me/919063909032" className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-black shadow-sm transition hover:-translate-y-0.5 hover:opacity-90">Get Started</a>
          </div>
        </nav>
      </header>

      <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
        {/* Header Section */}
        <section className="bg-white border-b border-gray-200">
          <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
            <div className="max-w-3xl">
              <h1 className="font-serif text-4xl md:text-5xl tracking-tight text-black mb-4">Transparent Pricing & Eligibility</h1>
              <p className="text-lg text-gray-600 mb-2">
                Discover your ideal loan tier with our interactive eligibility checker. See real-time calculations, compare interest rates, and understand exactly what you'll pay.
              </p>
              <p className="text-base text-gray-500">
                No hidden charges. No surprises. Just clear, transparent pricing for modern professionals.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Left Sidebar - Eligibility & Input */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <EligibilityChecker
                  onCheckEligibility={handleEligibilityCheck}
                  onLoanDataChange={handleLoanUpdate}
                  currentLoanData={loanData}
                />
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-16">
              {/* Pricing Tiers */}
              <section className="scroll-mt-8">
                <div className="mb-8">
                  <h2 className="font-serif text-3xl md:text-4xl tracking-tight text-black mb-3">Available Pricing Tiers</h2>
                  <p className="text-gray-600">Choose the tier that matches your financial profile. Higher tiers offer better interest rates and larger loan amounts.</p>
                </div>
                <PricingTiers currentTier={eligibilityResult?.tier} />
              </section>

              {/* Charts and Visualizations */}
              <section className="scroll-mt-8">
                <div className="mb-8">
                  <h2 className="font-serif text-3xl md:text-4xl tracking-tight text-black mb-3">Real-Time Analysis</h2>
                  <p className="text-gray-600">See how interest rates, EMI, and total cost compare across different loan amounts and tenures.</p>
                </div>
                <ComparisonCharts loanAmount={loanData.amount} />
              </section>

              {/* Repayment Schedule */}
              {eligibilityResult && (
                <section className="scroll-mt-8">
                  <div className="mb-8">
                    <h2 className="font-serif text-3xl md:text-4xl tracking-tight text-black mb-3">Your Repayment Schedule</h2>
                    <p className="text-gray-600">Detailed month-by-month breakdown of your loan repayment based on the selected amount and tenure.</p>
                  </div>
                  <RepaymentSchedule loanData={loanData} />
                </section>
              )}

              {/* CTA Section */}
              <section className="mt-16 bg-black text-white rounded-2xl p-8 md:p-12">
                <h3 className="font-serif text-2xl md:text-3xl mb-4">Ready to Apply?</h3>
                <p className="text-gray-300 mb-6">
                  {eligibilityResult 
                    ? `You're eligible for the ${eligibilityResult.tier} tier. Connect with us on WhatsApp to complete your application in minutes.`
                    : 'Check your eligibility above to see which tier matches your profile, then reach out to us to get started.'}
                </p>
                <a href="https://wa.me/919063909032" className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm md:text-base font-medium text-black shadow-sm transition hover:-translate-y-0.5 hover:opacity-90">
                  Apply Now on WhatsApp
                </a>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-sm text-white/70">&copy; 2025 Finomaa. All rights reserved.</p>
              <p className="text-sm text-white/70">A venture of YOOMAA CAPITAL PVT LTD.</p>
            </div>
            <div className="flex gap-4">
              <a href="https://wa.me/919063909032" className="text-white/70 hover:text-white transition">WhatsApp</a>
              <a href="mailto:support@finomaa.com" className="text-white/70 hover:text-white transition">Email</a>
              <a href="tel:+919063909032" className="text-white/70 hover:text-white transition">Call</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
