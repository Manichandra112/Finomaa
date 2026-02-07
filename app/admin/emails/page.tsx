'use client'

import { useState, useEffect } from 'react'
import {
  getAllEmailTemplates,
  getAllEmailNotifications,
  renderEmailTemplate,
} from '@/lib/email'
import { EmailTemplate, EmailNotification } from '@/lib/types'

export default function EmailPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [notifications, setNotifications] = useState<EmailNotification[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [selectedNotification, setSelectedNotification] = useState<EmailNotification | null>(
    null
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const tmpl = getAllEmailTemplates()
      const notif = getAllEmailNotifications()
      setTemplates(tmpl)
      setNotifications(notif)
      setLoading(false)
    }

    loadData()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'application_submitted':
        return 'bg-blue-100 text-blue-800'
      case 'application_approved':
        return 'bg-green-100 text-green-800'
      case 'application_rejected':
        return 'bg-red-100 text-red-800'
      case 'loan_disbursed':
        return 'bg-purple-100 text-purple-800'
      case 'repayment_due':
        return 'bg-orange-100 text-orange-800'
      case 'repayment_received':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const sentCount = notifications.filter((n) => n.status === 'sent').length
  const failedCount = notifications.filter((n) => n.status === 'failed').length
  const pendingCount = notifications.filter((n) => n.status === 'pending').length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Management</h1>
        <p className="text-gray-600">Manage email templates and track notification delivery</p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        {[
          { label: 'Total Sent', value: sentCount, color: 'bg-green-50 text-green-700' },
          { label: 'Total Failed', value: failedCount, color: 'bg-red-50 text-red-700' },
          { label: 'Pending', value: pendingCount, color: 'bg-yellow-50 text-yellow-700' },
          {
            label: 'Success Rate',
            value: `${notifications.length > 0 ? ((sentCount / notifications.length) * 100).toFixed(1) : 0}%`,
            color: 'bg-blue-50 text-blue-700',
          },
        ].map((stat, idx) => (
          <div key={idx} className={`rounded-xl border border-gray-200 ${stat.color} p-6`}>
            <p className="text-sm font-medium opacity-80 mb-2">{stat.label}</p>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setSelectedTemplate(templates[0] || null)}
          className={`px-6 py-3 font-medium border-b-2 transition ${
            selectedTemplate ? 'border-black text-black' : 'border-transparent text-gray-600'
          }`}
        >
          Email Templates ({templates.length})
        </button>
        <button
          onClick={() => setSelectedTemplate(null)}
          className={`px-6 py-3 font-medium border-b-2 transition ${
            !selectedTemplate ? 'border-black text-black' : 'border-transparent text-gray-600'
          }`}
        >
          Sent Notifications ({notifications.length})
        </button>
      </div>

      {/* Email Templates */}
      {selectedTemplate !== null && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Email Templates</h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
              <p className="mt-2 text-gray-600">Loading templates...</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => setSelectedTemplate(template)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                      {template.variables.length} variables
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{template.subject}</p>
                  <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded max-h-24 overflow-hidden">
                    {template.body.substring(0, 150)}...
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {template.variables.map((v) => (
                      <span key={v} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        {'{{'}{v}{'}'}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Email Notifications */}
      {selectedTemplate === null && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Sent Notifications</h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
              <p className="mt-2 text-gray-600">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12 text-gray-600">No notifications sent yet</div>
          ) : (
            <div className="space-y-4">
              {notifications.slice(0, 50).map((notif) => (
                <div
                  key={notif.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(notif.type)}`}>
                          {notif.type.replace(/_/g, ' ').toUpperCase()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(notif.status)}`}>
                          {notif.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 font-medium">{notif.template.subject}</p>
                      <p className="text-xs text-gray-600 mt-1">To: {notif.recipient}</p>
                    </div>
                    <button
                      onClick={() => setSelectedNotification(notif)}
                      className="text-blue-600 hover:underline text-sm font-medium"
                    >
                      View
                    </button>
                  </div>

                  <div className="mt-2 text-xs text-gray-600">
                    {notif.sentAt && `Sent: ${new Date(notif.sentAt).toLocaleString('en-IN')}`}
                    {notif.failureReason && (
                      <div className="mt-1 text-red-600">Error: {notif.failureReason}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-96 overflow-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Email Details</h2>
              <button
                onClick={() => setSelectedNotification(null)}
                className="text-2xl text-gray-600 hover:text-gray-900"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">To:</label>
                <p className="text-gray-700">{selectedNotification.recipient}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Subject:</label>
                <p className="text-gray-700">{selectedNotification.template.subject}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Body:</label>
                <div className="bg-gray-50 p-4 rounded text-sm text-gray-700 whitespace-pre-wrap max-h-48 overflow-auto">
                  {selectedNotification.template.body}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Variables Used:</label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(selectedNotification.variables).map(([key, value]) => (
                    <div key={key} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      {key}: {value}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
