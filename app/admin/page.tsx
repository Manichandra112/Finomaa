'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getAllLoanApplications } from '@/lib/loans'
import { getAllAuditLogs } from '@/lib/audit'
import { getAllEmailNotifications } from '@/lib/email'
import { LoanApplication, AuditLog, EmailNotification } from '@/lib/types'

export default function AdminDashboard() {
  const [applications, setApplications] = useState<LoanApplication[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [emailNotifications, setEmailNotifications] = useState<EmailNotification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const apps = getAllLoanApplications()
      const logs = getAllAuditLogs()
      const emails = getAllEmailNotifications()

      setApplications(apps)
      setAuditLogs(logs)
      setEmailNotifications(emails)
      setLoading(false)
    }

    loadData()
  }, [])

  const stats = {
    totalApplications: applications.length,
    approvedLoans: applications.filter((a) => a.status === 'approved').length,
    activeLoan: applications.filter((a) => a.status === 'disbursed').length,
    auditLogCount: auditLogs.length,
    emailsSent: emailNotifications.filter((e) => e.status === 'sent').length,
    emailsFailed: emailNotifications.filter((e) => e.status === 'failed').length,
  }

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
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-black to-gray-800 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to Admin Portal</h1>
        <p className="text-gray-300">Manage loans, monitor system activity, and track performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-3">
        {[
          {
            label: 'Total Applications',
            value: stats.totalApplications,
            color: 'bg-blue-50 text-blue-700',
            link: '/admin/analytics',
          },
          {
            label: 'Active Loans',
            value: stats.activeLoan,
            color: 'bg-green-50 text-green-700',
            link: '/admin/analytics',
          },
          {
            label: 'Audit Events',
            value: stats.auditLogCount,
            color: 'bg-purple-50 text-purple-700',
            link: '/admin/audit',
          },
        ].map((stat, idx) => (
          <Link
            key={idx}
            href={stat.link}
            className={`rounded-xl border border-gray-200 ${stat.color} p-6 hover:shadow-md transition`}
          >
            <p className="text-sm font-medium opacity-80 mb-2">{stat.label}</p>
            <p className="text-3xl font-bold">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Applications */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Applications</h2>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
            </div>
          ) : applications.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No applications yet</p>
          ) : (
            <div className="space-y-4">
              {applications.slice(0, 5).map((app) => (
                <div key={app.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">₹{app.loanAmount.toLocaleString('en-IN')}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        app.status
                      )}`}
                    >
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {app.tenure} months • {app.tier.charAt(0).toUpperCase() + app.tier.slice(1)} tier • {app.interestRate}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(app.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
              ))}

              <Link
                href="/admin/analytics"
                className="block text-center py-3 text-sm font-medium text-blue-600 hover:underline border-t border-gray-200 pt-4"
              >
                View All Applications →
              </Link>
            </div>
          )}
        </div>

        {/* Email Status */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Email Status</h2>

          <div className="space-y-4 mb-6">
            {[
              {
                label: 'Emails Sent',
                value: stats.emailsSent,
                color: 'text-green-700',
                bgColor: 'bg-green-50',
              },
              {
                label: 'Emails Failed',
                value: stats.emailsFailed,
                color: 'text-red-700',
                bgColor: 'bg-red-50',
              },
              {
                label: 'Success Rate',
                value:
                  emailNotifications.length > 0
                    ? `${((stats.emailsSent / emailNotifications.length) * 100).toFixed(1)}%`
                    : 'N/A',
                color: 'text-blue-700',
                bgColor: 'bg-blue-50',
              },
            ].map((item, idx) => (
              <div key={idx} className={`${item.bgColor} rounded-lg p-4`}>
                <p className="text-sm opacity-80 mb-1">{item.label}</p>
                <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>

          <Link
            href="/admin/emails"
            className="block text-center py-3 text-sm font-medium text-blue-600 hover:underline border-t border-gray-200 pt-4"
          >
            Manage Email Templates →
          </Link>
        </div>
      </div>

      {/* Recent Audit Events */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Audit Events</h2>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : auditLogs.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No audit logs yet</p>
        ) : (
          <div className="space-y-3">
            {auditLogs.slice(0, 10).map((log) => (
              <div key={log.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{log.action}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      User: {log.userId.slice(0, 8)}... • Entity: {log.entityType}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(log.timestamp).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))}

            <Link
              href="/admin/audit"
              className="block text-center py-3 text-sm font-medium text-blue-600 hover:underline border-t border-gray-200 pt-4"
            >
              View All Audit Logs →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
