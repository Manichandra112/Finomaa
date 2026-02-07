import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'Finomaa — Quietly Powerful Finance',
  description: 'Finoma: Quick funds with transparent terms. Minimal, luxurious fintech for modern professionals.',
  openGraph: {
    title: 'Finomaa — Quietly Powerful Finance',
    description: 'Quick funds with transparent terms. Transparent, fast credit for modern professionals.',
    images: ['/banner.jpg'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth antialiased">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Finomaa',
            url: 'https://finomaa.com',
            logo: 'https://finomaa.com/logo-512x512.png',
          })}
        </script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} bg-white text-gray-900 font-sans`}>
        {children}
      </body>
    </html>
  )
}
