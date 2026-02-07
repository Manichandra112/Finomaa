'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated and is admin
    const token = localStorage.getItem('session_token')
    const userEmail = localStorage.getItem('user_email')

    // For demo purposes, users with @finomaa.com email are admins
    if (!token || !userEmail?.includes('@finomaa.com')) {
      router.push('/auth/login')
    } else {
      setIsAdmin(true)
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

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3 hover:opacity-80 transition">
            <div className="h-8 w-8 rounded-md bg-black flex items-center justify-center overflow-hidden">
              <img src="/banner.jpg" alt="Finomaa" className="h-full w-full object-cover" />
            </div>
            <img src="/headingimage.jpg" alt="Finomaa" className="h-5 w-auto" />
            <span className="text-sm font-semibold text-gray-600 ml-2">Admin Portal</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Admin Dashboard</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex gap-8">
            <Link
              href="/admin"
              className="px-0 py-4 font-medium text-gray-900 border-b-2 border-black text-sm"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/analytics"
              className="px-0 py-4 font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent text-sm"
            >
              Analytics
            </Link>
            <Link
              href="/admin/audit"
              className="px-0 py-4 font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent text-sm"
            >
              Audit Logs
            </Link>
            <Link
              href="/admin/emails"
              className="px-0 py-4 font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent text-sm"
            >
              Email Management
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {children}
      </main>
    </div>
  )
}
