'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { loginUser } from '@/lib/auth'
import { logAudit } from '@/lib/audit'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await loginUser(email, password)

      if (!result.success) {
        setError(result.error || 'Login failed')
        
        // Log failed login attempt
        await logAudit({
          userId: 'unknown',
          action: 'login_failed',
          category: 'authentication',
          entityType: 'user',
          entityId: email,
          status: 'failure',
          errorMessage: result.error,
        })

        return
      }

      // Log successful login
      await logAudit({
        userId: result.session!.userId,
        action: 'user_login',
        category: 'authentication',
        entityType: 'user',
        entityId: result.session!.userId,
        status: 'success',
      })

      // Store session in localStorage
      localStorage.setItem('session_token', result.session!.token)
      localStorage.setItem('user_id', result.session!.userId)

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-8 hover:opacity-80 transition">
          <div className="h-10 w-10 rounded-md bg-white/10 ring-1 ring-white/20 flex items-center justify-center overflow-hidden">
            <img src="/banner.jpg" alt="Finomaa logo" className="h-full w-full object-cover" />
          </div>
          <img src="/headingimage.jpg" alt="Finomaa" className="h-6 w-auto" />
        </Link>

        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 shadow-xl">
          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-white/70 mb-8">Sign in to your Finomaa account</p>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/70 text-sm">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-white font-semibold hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-white/50 text-xs mt-8">
          © 2025 Finomaa. Quietly Powerful Finance.
        </p>
      </div>
    </div>
  )
}
