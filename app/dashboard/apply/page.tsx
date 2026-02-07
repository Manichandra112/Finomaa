'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createLoanApplication, submitLoanApplication, calculateRepaymentSchedule } from '@/lib/loans'
import { logAudit } from '@/lib/audit'
import { sendNotificationEmail } from '@/lib/email'
import { LoanApplication } from '@/lib/types'

export default function ApplyPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    loanAmount: 500000,
    tenure: 12,
    annualSalary: 1000000,
  })
  const [application, setApplication] = useState<LoanApplication | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const userId = typeof window !== 'undefined' ? localStorage.getItem('user_id') || '' : ''

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.name === 'loanAmount' || e.target.name === 'tenure' || e.target.name === 'annualSalary' 
        ? parseInt(e.target.value) 
        : e.target.value,
    })
  }

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await createLoanApplication(
        userId,
        formData.loanAmount,
        formData.tenure,
        formData.annualSalary
      )

      if (!result.success) {
        setError(result.error || 'Failed to create application')
        setLoading(false)
        return
      }

      // Submit the application
      await submitLoanApplication(result.application!.id)

      // Log the application creation
      await logAudit({
        userId,
        action: 'loan_application_created',
        category: 'application',
        entityType: 'application',
        entityId: result.application!.id,
        changes: [
          { field: 'status', oldValue: 'none', newValue: 'submitted' },
          { field: 'loanAmount', oldValue: null, newValue: formData.loanAmount },
          { field: 'tier', oldValue: null, newValue: result.application!.tier },
        ],
        status: 'success',
      })

      // Send notification email
      const userEmail = localStorage.getItem('user_email') || ''
      const userName = userEmail.split('@')[0]

      await sendNotificationEmail(userId, userEmail, 'application_submitted', {
        userName,
        loanAmount: formData.loanAmount.toLocaleString('en-IN'),
        tenure: formData.tenure.toString(),
        interestRate: result.application!.interestRate.toFixed(2),
        tier: result.application!.tier,
        applicationId: result.application!.id,
      })

      setApplication(result.application!)
      setStep(2)
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const repaymentSchedule = application
    ? calculateRepaymentSchedule(
        application.loanAmount,
        application.interestRate,
        application.tenure
      )
    : null

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Apply for a Loan</h1>
        <p className="text-gray-600">Fill in your details to get loan eligibility and repayment options</p>
      </div>

      {/* Step Indicator */}
      <div className="flex gap-4 justify-center">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step >= 1 ? 'bg-black text-white' : 'bg-gray-200'}`}>
            1
          </div>
          <span className="text-sm font-medium">Loan Details</span>
        </div>
        <div className="flex-1 h-0.5 bg-gray-200 my-4"></div>
        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step >= 2 ? 'bg-black text-white' : 'bg-gray-200'}`}>
            2
          </div>
          <span className="text-sm font-medium">Review & Submit</span>
        </div>
      </div>

      {/* Step 1: Loan Details */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <form onSubmit={handleSubmitApplication} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Annual Salary
              </label>
              <input
                type="number"
                name="annualSalary"
                value={formData.annualSalary}
                onChange={handleChange}
                min="300000"
                max="10000000"
                step="50000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
              <p className="mt-1 text-xs text-gray-600">
                ₹{formData.annualSalary.toLocaleString('en-IN')} per year
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Loan Amount
              </label>
              <input
                type="number"
                name="loanAmount"
                value={formData.loanAmount}
                onChange={handleChange}
                min="100000"
                max="30000000"
                step="50000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
              <p className="mt-1 text-xs text-gray-600">
                ₹{formData.loanAmount.toLocaleString('en-IN')}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Tenure (Months)
              </label>
              <select
                name="tenure"
                value={formData.tenure}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              >
                {[6, 12, 24, 36, 48, 60].map((m) => (
                  <option key={m} value={m}>
                    {m} months
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Checking Eligibility...' : 'Continue to Review'}
            </button>
          </form>
        </div>
      )}

      {/* Step 2: Review & Submit */}
      {step === 2 && application && repaymentSchedule && (
        <div className="space-y-8">
          {/* Application Summary */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Application Summary</h2>

            <div className="grid gap-6 md:grid-cols-2">
              {[
                { label: 'Loan Amount', value: `₹${application.loanAmount.toLocaleString('en-IN')}` },
                { label: 'Interest Rate', value: `${application.interestRate}% p.a.` },
                { label: 'Tenure', value: `${application.tenure} months` },
                { label: 'Your Tier', value: application.tier.toUpperCase() },
                { label: 'Monthly EMI', value: `₹${repaymentSchedule.monthlyEmi.toLocaleString('en-IN')}` },
                { label: 'Total Amount', value: `₹${repaymentSchedule.totalAmount.toLocaleString('en-IN')}` },
                { label: 'Total Interest', value: `₹${repaymentSchedule.totalInterest.toLocaleString('en-IN')}` },
              ].map((item, idx) => (
                <div key={idx} className="border-b border-gray-200 pb-4">
                  <p className="text-sm text-gray-600 mb-1">{item.label}</p>
                  <p className="text-lg font-bold text-gray-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Repayment Schedule Preview */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Repayment Schedule (First 6 months)</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 font-semibold text-gray-700">Month</th>
                    <th className="text-right py-3 font-semibold text-gray-700">Principal</th>
                    <th className="text-right py-3 font-semibold text-gray-700">Interest</th>
                    <th className="text-right py-3 font-semibold text-gray-700">EMI</th>
                    <th className="text-right py-3 font-semibold text-gray-700">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {repaymentSchedule.schedule.slice(0, 6).map((row) => (
                    <tr key={row.month} className="border-b border-gray-100">
                      <td className="py-3 text-gray-900">{row.month}</td>
                      <td className="text-right py-3 text-gray-600">
                        ₹{row.principalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="text-right py-3 text-gray-600">
                        ₹{row.interestAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="text-right py-3 font-semibold text-gray-900">
                        ₹{row.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="text-right py-3 text-gray-600">
                        ₹{row.remainingBalance.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-900 hover:bg-gray-50 transition"
            >
              Edit Details
            </button>
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition inline-block"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
