'use client'

import { useState, useEffect } from 'react'
import { getAuditLogs, getComplianceReport, getAllAuditLogs } from '@/lib/audit'
import { AuditLog } from '@/lib/types'

export default function AuditPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [complianceReport, setComplianceReport] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [filterCategory, setFilterCategory] = useState<string>('')

  useEffect(() => {
    const loadData = async () => {
      // Load all audit logs
      const logs = getAllAuditLogs()
      setAuditLogs(logs)

      // Load compliance report for last 30 days
      const from = new Date()
      from.setDate(from.getDate() - 30)
      const to = new Date()

      const report = await getComplianceReport({ from, to })
      setComplianceReport(report)

      setLoading(false)
    }

    loadData()
  }, [])

  const filteredLogs = filterCategory
    ? auditLogs.filter((log) => log.category === filterCategory)
    : auditLogs

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'authentication':
        return 'bg-blue-50 text-blue-700'
      case 'application':
        return 'bg-purple-50 text-purple-700'
      case 'document':
        return 'bg-green-50 text-green-700'
      case 'transaction':
        return 'bg-orange-50 text-orange-700'
      case 'admin':
        return 'bg-red-50 text-red-700'
      default:
        return 'bg-gray-50 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    return status === 'success' ? '✅' : '❌'
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Audit Logs & Compliance</h1>
        <p className="text-gray-600">Monitor all system activities and generate compliance reports</p>
      </div>

      {/* Compliance Summary */}
      {complianceReport && (
        <div className="grid gap-6 md:grid-cols-4">
          {[
            {
              label: 'Total Actions',
              value: complianceReport.totalActions,
              color: 'bg-blue-50 text-blue-700',
            },
            {
              label: 'Successful',
              value: complianceReport.successfulActions,
              color: 'bg-green-50 text-green-700',
            },
            {
              label: 'Failed',
              value: complianceReport.failedActions,
              color: 'bg-red-50 text-red-700',
            },
            {
              label: 'Success Rate',
              value: `${((complianceReport.successfulActions / complianceReport.totalActions) * 100).toFixed(1)}%`,
              color: 'bg-purple-50 text-purple-700',
            },
          ].map((stat, idx) => (
            <div key={idx} className={`rounded-xl border border-gray-200 ${stat.color} p-6`}>
              <p className="text-sm font-medium opacity-80 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Category Breakdown */}
      {complianceReport && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Actions by Category</h2>
          <div className="space-y-4">
            {Object.entries(complianceReport.byCategory).map(([category, count]: [string, any]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                <div className="flex items-center gap-4">
                  <div className="w-64 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-black h-2 rounded-full"
                      style={{
                        width: `${(count / complianceReport.totalActions) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-gray-700 font-semibold min-w-12 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit Logs */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Activity Log</h2>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">All Categories</option>
            <option value="authentication">Authentication</option>
            <option value="application">Application</option>
            <option value="document">Document</option>
            <option value="transaction">Transaction</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
            <p className="mt-2 text-gray-600">Loading audit logs...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-gray-600">No audit logs found</div>
        ) : (
          <div className="space-y-4">
            {filteredLogs.slice(0, 50).map((log) => (
              <div key={log.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getStatusIcon(log.status)}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{log.action}</p>
                      <p className="text-xs text-gray-600">
                        User ID: {log.userId.slice(0, 8)}... | Entity: {log.entityType}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(log.category)}`}>
                    {log.category}
                  </span>
                </div>

                {log.changes && log.changes.length > 0 && (
                  <div className="mt-3 text-xs text-gray-600 bg-gray-50 rounded p-2">
                    <p className="font-medium mb-1">Changes:</p>
                    <ul className="space-y-1">
                      {log.changes.map((change, idx) => (
                        <li key={idx}>
                          <span className="font-medium">{change.field}:</span> {change.oldValue} → {change.newValue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-2 flex items-center justify-between text-xs text-gray-600">
                  <span>{log.ipAddress}</span>
                  <span>{new Date(log.timestamp).toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
