import crypto from 'crypto'
import { AuditLog } from './types'

// Simulated in-memory audit log storage (replace with database)
const auditLogs = new Map<string, AuditLog>()

export interface LogAuditParams {
  userId: string
  action: string
  category: 'authentication' | 'application' | 'document' | 'transaction' | 'admin'
  entityType: 'user' | 'application' | 'document' | 'transaction'
  entityId: string
  changes?: {
    field: string
    oldValue: any
    newValue: any
  }[]
  ipAddress?: string
  userAgent?: string
  status?: 'success' | 'failure'
  errorMessage?: string
}

export async function logAudit(params: LogAuditParams): Promise<AuditLog> {
  const auditLog: AuditLog = {
    id: crypto.randomUUID(),
    userId: params.userId,
    action: params.action,
    category: params.category,
    entityType: params.entityType,
    entityId: params.entityId,
    changes: params.changes || [],
    ipAddress: params.ipAddress || 'unknown',
    userAgent: params.userAgent || 'unknown',
    timestamp: new Date(),
    status: params.status || 'success',
    errorMessage: params.errorMessage,
  }

  auditLogs.set(auditLog.id, auditLog)
  console.log('[Audit]', auditLog.action, '-', auditLog.category)

  return auditLog
}

export async function getAuditLogs(
  filters?: {
    userId?: string
    category?: string
    entityType?: string
    dateFrom?: Date
    dateTo?: Date
    limit?: number
    offset?: number
  }
): Promise<AuditLog[]> {
  let logs = Array.from(auditLogs.values())

  if (filters?.userId) {
    logs = logs.filter((log) => log.userId === filters.userId)
  }

  if (filters?.category) {
    logs = logs.filter((log) => log.category === filters.category)
  }

  if (filters?.entityType) {
    logs = logs.filter((log) => log.entityType === filters.entityType)
  }

  if (filters?.dateFrom) {
    logs = logs.filter((log) => log.timestamp >= filters.dateFrom!)
  }

  if (filters?.dateTo) {
    logs = logs.filter((log) => log.timestamp <= filters.dateTo!)
  }

  // Sort by timestamp descending
  logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  // Apply pagination
  const offset = filters?.offset || 0
  const limit = filters?.limit || 50

  return logs.slice(offset, offset + limit)
}

export async function getUserAuditLogs(
  userId: string,
  limit = 50
): Promise<AuditLog[]> {
  return getAuditLogs({ userId, limit })
}

export async function getComplianceReport(dateRange: {
  from: Date
  to: Date
}): Promise<{
  totalActions: number
  successfulActions: number
  failedActions: number
  byCategory: Record<string, number>
  byUser: Record<string, number>
}> {
  const logs = await getAuditLogs({
    dateFrom: dateRange.from,
    dateTo: dateRange.to,
  })

  const byCategory: Record<string, number> = {}
  const byUser: Record<string, number> = {}
  let successCount = 0
  let failureCount = 0

  logs.forEach((log) => {
    // Count by category
    byCategory[log.category] = (byCategory[log.category] || 0) + 1

    // Count by user
    byUser[log.userId] = (byUser[log.userId] || 0) + 1

    // Count success/failure
    if (log.status === 'success') {
      successCount++
    } else {
      failureCount++
    }
  })

  return {
    totalActions: logs.length,
    successfulActions: successCount,
    failedActions: failureCount,
    byCategory,
    byUser,
  }
}

// Export in-memory logs for analytics
export function getAllAuditLogs(): AuditLog[] {
  return Array.from(auditLogs.values()).sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  )
}
