'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getUserLoanApplications } from '@/lib/loans'
import { LoanApplication } from '@/lib/types'

export default function DashboardPage() {
  const [applications, setApplications] = useState<LoanApplication[]>([])
  const [loading, setLoading] = useState(true)
  const userId = typeof window !== 'undefined' ? localStorage.getItem('user_id') || '' : ''

  useEffect(() => {
    const loadApplications = async () => {
      if (userId) {
        const apps = await getUserLoanApplications(userId)
        setApplications(apps)
      }
      setLoading(false)
    }

    loadApplications()
  }, [userId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'submitted':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'disbursed':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'draft':
        return 'bg-gray-50 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'platinum':
        return 'bg-yellow-100 text-yellow-800'
      case 'gold':
        return 'bg-orange-100 text-orange-800'
      case 'silver':
        return 'bg-gray-100 text-gray-800'
      case 'bronze':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Loans Dashboard</h1>
        <p className="text-gray-600">Manage your loan applications and track repayments</p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        {[
          {
            label: 'Total Applications',
            value: applications.length,
            icon: '📋',
          },
          {
            label: 'Approved',
            value: applications.filter((a) => a.status === 'approved').length,
            icon: '✅',
          },
          {
            label: 'Active Loans',
            value: applications.filter((a) => a.status === 'disbursed').length,
            icon: '💰',
          },
          {
            label: 'Pending',
            value: applications.filter((a) => a.status === 'submitted').length,
            icon: '⏳',
          },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Your Applications</h2>
          <Link
            href="/dashboard/apply"
            className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition"
          >
            New Application
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
            <p className="mt-2 text-gray-600">Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No loan applications yet</p>
            <Link
              href="/dashboard/apply"
              className="px-6 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition"
            >
              Create Your First Application
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 font-semibold text-gray-700">Application ID</th>
                  <th className="text-left py-3 font-semibold text-gray-700">Loan Amount</th>
                  <th className="text-left py-3 font-semibold text-gray-700">Tenure</th>
                  <th className="text-left py-3 font-semibold text-gray-700">Tier</th>
                  <th className="text-left py-3 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-3 font-mono text-xs text-gray-600">
                      {app.id.slice(0, 8)}...
                    </td>
                    <td className="py-3 font-semibold text-gray-900">
                      ₹{app.loanAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 text-gray-600">{app.tenure} months</td>
                    <td className="py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getTierBadgeColor(
                          app.tier
                        )}`}
                      >
                        {app.tier.charAt(0).toUpperCase() + app.tier.slice(1)}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          app.status
                        )}`}
                      >
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 text-gray-600 text-xs">
                      {new Date(app.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3">
                      <Link
                        href={`/dashboard/application/${app.id}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
