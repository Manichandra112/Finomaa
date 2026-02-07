import crypto from 'crypto'
import { EmailTemplate, EmailNotification } from './types'

// Email Templates
const emailTemplates: Record<string, EmailTemplate> = {
  application_submitted: {
    id: '1',
    name: 'Application Submitted',
    subject: 'Loan Application Submitted - Reference: {{applicationId}}',
    body: `
Dear {{userName}},

Your loan application has been successfully submitted.

Application Details:
- Loan Amount: ₹{{loanAmount}}
- Tenure: {{tenure}} months
- Expected Interest Rate: {{interestRate}}%
- Your Tier: {{tier}}
- Application ID: {{applicationId}}

We will review your application and contact you within 24 hours.

Best regards,
Finomaa Team
    `.trim(),
    variables: [
      'userName',
      'loanAmount',
      'tenure',
      'interestRate',
      'tier',
      'applicationId',
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  application_approved: {
    id: '2',
    name: 'Application Approved',
    subject: 'Loan Application Approved - ₹{{loanAmount}}',
    body: `
Dear {{userName}},

Congratulations! Your loan application has been approved.

Approved Loan Details:
- Approved Amount: ₹{{loanAmount}}
- Interest Rate: {{interestRate}}%
- Tenure: {{tenure}} months
- Monthly EMI: ₹{{monthlyEmi}}
- Total Amount to Repay: ₹{{totalAmount}}
- Approval Date: {{approvalDate}}

Your funds will be disbursed to your account within 24 business hours.

Best regards,
Finomaa Team
    `.trim(),
    variables: [
      'userName',
      'loanAmount',
      'interestRate',
      'tenure',
      'monthlyEmi',
      'totalAmount',
      'approvalDate',
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  application_rejected: {
    id: '3',
    name: 'Application Rejected',
    subject: 'Loan Application Update',
    body: `
Dear {{userName}},

Thank you for applying for a loan with Finomaa.

Unfortunately, we are unable to process your application at this time due to {{rejectionReason}}.

We encourage you to reapply in 30 days when your eligibility criteria might have changed.

If you have any questions, please contact our support team.

Best regards,
Finomaa Team
    `.trim(),
    variables: ['userName', 'rejectionReason'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  loan_disbursed: {
    id: '4',
    name: 'Loan Disbursed',
    subject: 'Loan Disbursed Successfully - ₹{{loanAmount}}',
    body: `
Dear {{userName}},

Your loan amount of ₹{{loanAmount}} has been successfully disbursed to your account.

Disbursement Details:
- Amount: ₹{{loanAmount}}
- Disbursed Date: {{disbursedDate}}
- Reference Number: {{referenceNumber}}
- First Payment Due: {{firstPaymentDue}}

Your repayment schedule is attached. Please ensure timely payments to maintain your credit profile.

Best regards,
Finomaa Team
    `.trim(),
    variables: [
      'userName',
      'loanAmount',
      'disbursedDate',
      'referenceNumber',
      'firstPaymentDue',
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  repayment_due: {
    id: '5',
    name: 'Repayment Due Reminder',
    subject: 'Payment Reminder - ₹{{paymentAmount}} due on {{dueDate}}',
    body: `
Dear {{userName}},

This is a friendly reminder that your loan repayment is due.

Payment Details:
- Amount Due: ₹{{paymentAmount}}
- Due Date: {{dueDate}}
- Month: {{monthNumber}}/{{totalMonths}}

Please ensure payment is made by the due date to avoid any penalties.

Best regards,
Finomaa Team
    `.trim(),
    variables: [
      'userName',
      'paymentAmount',
      'dueDate',
      'monthNumber',
      'totalMonths',
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  repayment_received: {
    id: '6',
    name: 'Repayment Received',
    subject: 'Payment Received - ₹{{paymentAmount}}',
    body: `
Dear {{userName}},

Thank you! Your payment has been received successfully.

Payment Details:
- Amount Paid: ₹{{paymentAmount}}
- Payment Date: {{paymentDate}}
- Reference Number: {{referenceNumber}}
- Remaining Balance: ₹{{remainingBalance}}
- Months Remaining: {{monthsRemaining}}

Your account is in good standing. Continue with timely payments.

Best regards,
Finomaa Team
    `.trim(),
    variables: [
      'userName',
      'paymentAmount',
      'paymentDate',
      'referenceNumber',
      'remainingBalance',
      'monthsRemaining',
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
}

// Email notifications storage (replace with database)
const emailNotifications = new Map<string, EmailNotification>()

export async function sendNotificationEmail(
  userId: string,
  recipient: string,
  notificationType: EmailNotification['type'],
  variables: Record<string, string>
): Promise<{ success: boolean; error?: string; notification?: EmailNotification }> {
  try {
    const template = emailTemplates[notificationType]

    if (!template) {
      return { success: false, error: `Email template not found: ${notificationType}` }
    }

    // Validate variables
    const missingVars = template.variables.filter((v) => !variables[v])
    if (missingVars.length > 0) {
      return {
        success: false,
        error: `Missing variables: ${missingVars.join(', ')}`,
      }
    }

    const notification: EmailNotification = {
      id: crypto.randomUUID(),
      userId,
      type: notificationType,
      template,
      recipient,
      variables,
      status: 'sent', // In production, this would be 'pending' and sent via email service
      sentAt: new Date(),
    }

    emailNotifications.set(notification.id, notification)

    // Log email sending
    console.log(`[Email] Sent to ${recipient}: ${notificationType}`)

    return { success: true, notification }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export function getEmailTemplate(
  templateName: keyof typeof emailTemplates
): EmailTemplate | null {
  return emailTemplates[templateName] || null
}

export function getAllEmailTemplates(): EmailTemplate[] {
  return Object.values(emailTemplates)
}

export function renderEmailTemplate(
  template: EmailTemplate,
  variables: Record<string, string>
): {
  subject: string
  body: string
} {
  let subject = template.subject
  let body = template.body

  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = new RegExp(`{{${key}}}`, 'g')
    subject = subject.replace(placeholder, value)
    body = body.replace(placeholder, value)
  })

  return { subject, body }
}

export function getEmailNotifications(userId: string): EmailNotification[] {
  return Array.from(emailNotifications.values())
    .filter((n) => n.userId === userId)
    .sort((a, b) => {
      const dateA = a.sentAt || new Date()
      const dateB = b.sentAt || new Date()
      return dateB.getTime() - dateA.getTime()
    })
}

export function getAllEmailNotifications(): EmailNotification[] {
  return Array.from(emailNotifications.values()).sort((a, b) => {
    const dateA = a.sentAt || new Date()
    const dateB = b.sentAt || new Date()
    return dateB.getTime() - dateA.getTime()
  })
}
