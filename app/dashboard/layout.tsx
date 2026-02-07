'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userId, setUserId] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('session_token')
    const storedUserId = localStorage.getItem('user_id')
    const userEmail = localStorage.getItem('user_email')

    if (!token || !storedUserId) {
      router.push('/auth/login')
    } else {
      setIsAuthenticated(true)
      setUserId(storedUserId)
      setUserEmail(userEmail || '')
      setLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('session_token')
    localStorage.removeItem('user_id')
    localStorage.removeItem('user_email')
    router.push('/auth/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <div className="h-8 w-8 rounded-md bg-black flex items-center justify-center overflow-hidden">
              <img src="/banner.jpg" alt="Finomaa" className="h-full w-full object-cover" />
            </div>
            <img src="/headingimage.jpg" alt="Finomaa" className="h-5 w-auto" />
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, {userEmail.split('@')[0]}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {children}
      </main>
    </div>
  )
}
