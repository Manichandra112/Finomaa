import crypto from 'crypto'
import { AuthSession, User } from './types'

// Simulated in-memory storage (replace with database)
const users = new Map<string, User & { passwordHash: string }>()
const sessions = new Map<string, AuthSession>()

// Password hashing (simplified for demo - use bcrypt in production)
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
}

export async function registerUser(
  email: string,
  password: string,
  fullName: string,
  phone: string
): Promise<{ success: boolean; error?: string; user?: User }> {
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { success: false, error: 'Invalid email format' }
  }

  // Check if user exists
  if (Array.from(users.values()).some((u) => u.email === email)) {
    return { success: false, error: 'Email already registered' }
  }

  // Validate password strength
  if (password.length < 8) {
    return { success: false, error: 'Password must be at least 8 characters' }
  }

  const userId = crypto.randomUUID()
  const user: User & { passwordHash: string } = {
    id: userId,
    email,
    fullName,
    phone,
    passwordHash: hashPassword(password),
    createdAt: new Date(),
    lastLogin: new Date(),
    status: 'active',
  }

  users.set(userId, user)

  // Audit log will be created separately
  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      status: user.status,
    },
  }
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; session?: AuthSession }> {
  const user = Array.from(users.values()).find((u) => u.email === email)

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { success: false, error: 'Invalid email or password' }
  }

  if (user.status !== 'active') {
    return { success: false, error: 'Account is not active' }
  }

  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  const session: AuthSession = {
    userId: user.id,
    email: user.email,
    fullName: user.fullName,
    token,
    expiresAt,
  }

  sessions.set(token, session)

  // Update last login
  user.lastLogin = new Date()

  return { success: true, session }
}

export async function verifySession(token: string): Promise<AuthSession | null> {
  const session = sessions.get(token)

  if (!session) return null

  if (new Date() > session.expiresAt) {
    sessions.delete(token)
    return null
  }

  return session
}

export async function logoutUser(token: string): Promise<boolean> {
  return sessions.delete(token)
}

export function getUserById(userId: string): User | null {
  const user = users.get(userId)
  if (!user) return null

  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    phone: user.phone,
    createdAt: user.createdAt,
    lastLogin: user.lastLogin,
    status: user.status,
  }
}

export function getSessionByToken(token: string): AuthSession | null {
  return sessions.get(token) || null
}
