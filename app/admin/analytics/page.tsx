'use client'

import { useState, useEffect } from 'react'
import { getAllLoanApplications, calculateRepaymentSchedule } from '@/lib/loans'
import { LoanApplication } from '@/lib/types'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export default function AnalyticsPage() {
  const [applications, setApplications] = useState<LoanApplication[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const apps = getAllLoanApplications()
      setApplications(apps)
      setLoading(false)
    }

    loadData()
  }, [])

  // Calculate metrics
  const metrics = {
    totalApplications: applications.length,
    approvedLoans: applications.filter((a) => a.status === 'approved').length,
    rejectedLoans: applications.filter((a) => a.status === 'rejected').length,
    activeLoan: applications.filter((a) => a.status === 'disbursed').length,
    totalDisbursed: applications
      .filter((a) => a.status === 'disbursed')
      .reduce((sum, a) => sum + a.loanAmount, 0),
  }

  const approvalRate =
    applications.length > 0
      ? ((metrics.approvedLoans / applications.length) * 100).toFixed(1)
      : 0

  // Data by tier
  const tiers = ['bronze', 'silver', 'gold', 'platinum']
  const tierData = tiers.map((tier) => {
    const tierApps = applications.filter((a) => a.tier === tier)
    return {
      name: tier.charAt(0).toUpperCase() + tier.slice(1),
      applications: tierApps.length,
      approved: tierApps.filter((a) => a.status === 'approved').length,
      avgAmount: tierApps.length > 0
        ? tierApps.reduce((sum, a) => sum + a.loanAmount, 0) / tierApps.length
        : 0,
    }
  })

  // Data by status
  const statusData = [
    { name: 'Draft', value: applications.filter((a) => a.status === 'draft').length },
    { name: 'Submitted', value: applications.filter((a) => a.status === 'submitted').length },
    { name: 'Approved', value: applications.filter((a) => a.status === 'approved').length },
    { name: 'Rejected', value: applications.filter((a) => a.status === 'rejected').length },
    { name: 'Disbursed', value: applications.filter((a) => a.status === 'disbursed').length },
  ]

  const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981']

  // Interest rate distribution
  const interestRateData = applications.reduce(
    (acc: Record<string, number>, app) => {
      const rate = Math.round(app.interestRate)
      acc[rate] = (acc[rate] || 0) + 1
      return acc
    },
    {}
  )

  const interestRateChartData = Object.entries(interestRateData).map(([rate, count]) => ({
    rate: `${rate}%`,
    count,
  }))

  // Average loan amount by tier
  const avgLoanByTier = applications.reduce(
    (acc: Record<string, { total: number; count: number }>, app) => {
      if (!acc[app.tier]) {
        acc[app.tier] = { total: 0, count: 0 }
      }
      acc[app.tier].total += app.loanAmount
      acc[app.tier].count += 1
      return acc
    },
    {}
  )

  const avgLoanData = Object.entries(avgLoanByTier).map(([tier, data]) => ({
    tier: tier.charAt(0).toUpperCase() + tier.slice(1),
    avgAmount: Math.round(data.total / data.count),
  }))

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">Comprehensive loan performance and business metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-5">
        {[
          {
            label: 'Total Applications',
            value: metrics.totalApplications,
            color: 'bg-blue-50 text-blue-700',
          },
          {
            label: 'Approved',
            value: metrics.approvedLoans,
            color: 'bg-green-50 text-green-700',
          },
          {
            label: 'Rejected',
            value: metrics.rejectedLoans,
            color: 'bg-red-50 text-red-700',
          },
          {
            label: 'Active Loans',
            value: metrics.activeLoan,
            color: 'bg-purple-50 text-purple-700',
          },
          {
            label: 'Approval Rate',
            value: `${approvalRate}%`,
            color: 'bg-orange-50 text-orange-700',
          },
        ].map((stat, idx) => (
          <div key={idx} className={`rounded-xl border border-gray-200 ${stat.color} p-6`}>
            <p className="text-sm font-medium opacity-80 mb-2">{stat.label}</p>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Application Status Distribution */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Applications by Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Tier Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Applications by Tier</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tierData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="applications" fill="#3B82F6" />
              <Bar dataKey="approved" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Interest Rate Distribution */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Interest Rate Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={interestRateChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rate" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Average Loan Amount by Tier */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Average Loan Amount by Tier</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={avgLoanData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tier" />
              <YAxis />
              <Tooltip formatter={(value: any) => `₹${value.toLocaleString('en-IN')}`} />
              <Bar dataKey="avgAmount" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Financial Overview</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              label: 'Total Disbursed',
              value: `₹${metrics.totalDisbursed.toLocaleString('en-IN')}`,
              color: 'text-green-700',
            },
            {
              label: 'Average Loan Amount',
              value: `₹${Math.round(
                applications.reduce((sum, a) => sum + a.loanAmount, 0) / applications.length
              ).toLocaleString('en-IN')}`,
              color: 'text-blue-700',
            },
            {
              label: 'Total Interest (Estimated)',
              value: `₹${Math.round(
                applications.reduce((sum, a) => {
                  const schedule = calculateRepaymentSchedule(
                    a.loanAmount,
                    a.interestRate,
                    a.tenure
                  )
                  return sum + schedule.totalInterest
                }, 0)
              ).toLocaleString('en-IN')}`,
              color: 'text-orange-700',
            },
          ].map((metric, idx) => (
            <div key={idx} className="border-b border-gray-200 pb-6">
              <p className="text-sm text-gray-600 mb-2">{metric.label}</p>
              <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
