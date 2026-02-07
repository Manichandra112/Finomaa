// User & Authentication Types
export interface User {
  id: string
  email: string
  fullName: string
  phone: string
  createdAt: Date
  lastLogin: Date
  status: 'active' | 'suspended' | 'inactive'
}

export interface AuthSession {
  userId: string
  email: string
  fullName: string
  token: string
  expiresAt: Date
}

// Loan Application Types
export interface LoanApplication {
  id: string
  userId: string
  loanAmount: number
  tenure: number
  annualSalary: number
  interestRate: number
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'disbursed' | 'completed'
  createdAt: Date
  submittedAt?: Date
  approvedAt?: Date
  disbursedAt?: Date
  documents?: Document[]
  personalInfo?: PersonalInfo
}

export interface PersonalInfo {
  dateOfBirth: string
  gender: string
  address: string
  city: string
  state: string
  pincode: string
  employment: {
    company: string
    designation: string
    yearsOfExperience: number
    employmentType: 'full-time' | 'self-employed' | 'contract'
  }
}

export interface Document {
  id: string
  applicationId: string
  type: 'aadhar' | 'pan' | 'salary_slip' | 'bank_statement' | 'employment_letter'
  url: string
  status: 'pending' | 'verified' | 'rejected'
  uploadedAt: Date
}

// Repayment & Transaction Types
export interface Repayment {
  id: string
  applicationId: string
  monthNumber: number
  dueDate: Date
  principalAmount: number
  interestAmount: number
  totalAmount: number
  status: 'pending' | 'paid' | 'overdue'
  paidDate?: Date
  paidAmount?: number
}

export interface Transaction {
  id: string
  applicationId: string
  type: 'disbursement' | 'repayment' | 'fee' | 'penalty'
  amount: number
  date: Date
  status: 'pending' | 'completed' | 'failed'
  reference: string
}

// Analytics Types
export interface LoanMetrics {
  totalApplications: number
  approvedLoans: number
  rejectedLoans: number
  activeLoans: number
  totalDisbursed: number
  totalRepaid: number
  defaultRate: number
  averageLoalAmount: number
}

export interface UserMetrics {
  totalUsers: number
  activeUsers: number
  newUsersThisMonth: number
  newUsersThisWeek: number
}

export interface DashboardMetrics {
  loan: LoanMetrics
  user: UserMetrics
  revenue: {
    totalInterestCollected: number
    totalFeesCollected: number
    thisMonthRevenue: number
  }
  performanceByTier: {
    tier: string
    count: number
    approvalRate: number
    avgLoanAmount: number
    avgInterestRate: number
  }[]
}

// Audit Log Types
export interface AuditLog {
  id: string
  userId: string
  action: string
  category: 'authentication' | 'application' | 'document' | 'transaction' | 'admin'
  entityType: 'user' | 'application' | 'document' | 'transaction'
  entityId: string
  changes: {
    field: string
    oldValue: any
    newValue: any
  }[]
  ipAddress: string
  userAgent: string
  timestamp: Date
  status: 'success' | 'failure'
  errorMessage?: string
}

// Email Notification Types
export interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  variables: string[]
  createdAt: Date
  updatedAt: Date
}

export interface EmailNotification {
  id: string
  userId: string
  type: 'application_submitted' | 'application_approved' | 'application_rejected' | 'loan_disbursed' | 'repayment_due' | 'repayment_received'
  template: EmailTemplate
  recipient: string
  variables: Record<string, string>
  status: 'pending' | 'sent' | 'failed'
  sentAt?: Date
  failureReason?: string
}

// Dashboard State Types
export interface DashboardState {
  user: User | null
  isLoading: boolean
  error: string | null
  metrics: DashboardMetrics | null
  applications: LoanApplication[]
  auditLogs: AuditLog[]
}
