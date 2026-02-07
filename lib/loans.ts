import crypto from 'crypto'
import { LoanApplication, Repayment } from './types'

// Loan applications storage
const loanApplications = new Map<string, LoanApplication>()

// Tier configuration
const tierConfig = {
  bronze: {
    minSalary: 300000,
    maxSalary: 600000,
    maxLoanAmount: 3000000,
    minInterestRate: 13,
    maxInterestRate: 14,
  },
  silver: {
    minSalary: 600000,
    maxSalary: 1500000,
    maxLoanAmount: 7500000,
    minInterestRate: 11,
    maxInterestRate: 12,
  },
  gold: {
    minSalary: 1500000,
    maxSalary: 3000000,
    maxLoanAmount: 15000000,
    minInterestRate: 9,
    maxInterestRate: 10,
  },
  platinum: {
    minSalary: 3000000,
    maxSalary: Infinity,
    maxLoanAmount: 30000000,
    minInterestRate: 7,
    maxInterestRate: 8,
  },
}

export type TierType = keyof typeof tierConfig

export function determineTier(annualSalary: number): TierType {
  if (annualSalary >= tierConfig.platinum.minSalary) return 'platinum'
  if (annualSalary >= tierConfig.gold.minSalary) return 'gold'
  if (annualSalary >= tierConfig.silver.minSalary) return 'silver'
  if (annualSalary >= tierConfig.bronze.minSalary) return 'bronze'
  return 'bronze'
}

export function getInterestRate(
  tier: TierType,
  loanAmount: number,
  maxLoanAmount: number
): number {
  const tierInfo = tierConfig[tier]
  const percentageOfMax = loanAmount / maxLoanAmount

  if (percentageOfMax > 0.8) {
    return tierInfo.maxInterestRate
  } else if (percentageOfMax > 0.5) {
    return tierInfo.maxInterestRate - 0.5
  } else {
    return tierInfo.minInterestRate
  }
}

export function checkEligibility(
  annualSalary: number,
  loanAmount: number
): {
  eligible: boolean
  tier: TierType
  maxLoanAmount: number
  reason?: string
} {
  const tier = determineTier(annualSalary)
  const tierInfo = tierConfig[tier]

  if (loanAmount > tierInfo.maxLoanAmount) {
    return {
      eligible: false,
      tier,
      maxLoanAmount: tierInfo.maxLoanAmount,
      reason: `Maximum loan amount for ${tier} tier is ₹${tierInfo.maxLoanAmount.toLocaleString('en-IN')}`,
    }
  }

  return {
    eligible: true,
    tier,
    maxLoanAmount: tierInfo.maxLoanAmount,
  }
}

export function calculateRepaymentSchedule(
  principal: number,
  annualRate: number,
  tenureMonths: number
): {
  monthlyEmi: number
  totalAmount: number
  totalInterest: number
  schedule: Array<{
    month: number
    principalAmount: number
    interestAmount: number
    totalAmount: number
    remainingBalance: number
  }>
} {
  const monthlyRate = annualRate / 100 / 12
  const emi =
    (principal *
      (monthlyRate * Math.pow(1 + monthlyRate, tenureMonths))) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1)

  let remainingBalance = principal
  const schedule = []
  let totalInterest = 0

  for (let month = 1; month <= tenureMonths; month++) {
    const interestAmount = remainingBalance * monthlyRate
    const principalAmount = emi - interestAmount
    remainingBalance -= principalAmount
    totalInterest += interestAmount

    schedule.push({
      month,
      principalAmount: Math.round(principalAmount),
      interestAmount: Math.round(interestAmount),
      totalAmount: Math.round(emi),
      remainingBalance: Math.max(0, Math.round(remainingBalance)),
    })
  }

  return {
    monthlyEmi: Math.round(emi),
    totalAmount: Math.round(principal + totalInterest),
    totalInterest: Math.round(totalInterest),
    schedule,
  }
}

export async function createLoanApplication(
  userId: string,
  loanAmount: number,
  tenure: number,
  annualSalary: number
): Promise<{
  success: boolean
  application?: LoanApplication
  error?: string
}> {
  try {
    const eligibility = checkEligibility(annualSalary, loanAmount)

    if (!eligibility.eligible) {
      return {
        success: false,
        error: eligibility.reason,
      }
    }

    const tier = eligibility.tier
    const tierInfo = tierConfig[tier]
    const interestRate = getInterestRate(tier, loanAmount, tierInfo.maxLoanAmount)

    const application: LoanApplication = {
      id: crypto.randomUUID(),
      userId,
      loanAmount,
      tenure,
      annualSalary,
      interestRate,
      tier,
      status: 'draft',
      createdAt: new Date(),
    }

    loanApplications.set(application.id, application)

    return { success: true, application }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function submitLoanApplication(
  applicationId: string
): Promise<boolean> {
  const application = loanApplications.get(applicationId)
  if (!application) return false

  application.status = 'submitted'
  application.submittedAt = new Date()
  loanApplications.set(applicationId, application)

  return true
}

export async function approveLoanApplication(
  applicationId: string
): Promise<boolean> {
  const application = loanApplications.get(applicationId)
  if (!application) return false

  application.status = 'approved'
  application.approvedAt = new Date()
  loanApplications.set(applicationId, application)

  return true
}

export async function getLoanApplication(
  applicationId: string
): Promise<LoanApplication | null> {
  return loanApplications.get(applicationId) || null
}

export async function getUserLoanApplications(
  userId: string
): Promise<LoanApplication[]> {
  return Array.from(loanApplications.values())
    .filter((app) => app.userId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export function getAllLoanApplications(): LoanApplication[] {
  return Array.from(loanApplications.values()).sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  )
}

export function getLoanApplicationsByStatus(
  status: LoanApplication['status']
): LoanApplication[] {
  return Array.from(loanApplications.values()).filter((app) => app.status === status)
}
