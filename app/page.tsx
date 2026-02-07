'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Navigation */}
      <header className="relative">
        <div className="absolute inset-0 bg-black"></div>
        <nav className="relative z-10">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex h-20 items-center justify-between">
              {/* Logo */}
              <a href="#home" className="flex items-center gap-3 text-white hover:opacity-80 transition focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2" aria-label="Finomaa Home">
                <div className="h-9 w-9 rounded-md bg-white/10 ring-1 ring-white/20 flex items-center justify-center overflow-hidden">
                  <img src="/banner.jpg" alt="Finomaa logo" className="h-full w-full object-cover" />
                </div>
                <div className="leading-tight">
                  <img src="/headingimage.jpg" alt="Finomaa Logo Text" className="h-6 w-auto" />
                  <span className="block text-xs text-white/70">Quick funds, Brighter tomorrow</span>
                </div>
              </a>

              {/* Desktop Menu */}
              <div className="hidden items-center gap-8 md:flex">
                <a href="#home" className="text-sm text-white/80 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-white">Home</a>
                <a href="#services" className="text-sm text-white/80 hover:text-white transition-colors">Services</a>
                <a href="#features" className="text-sm text-white/80 hover:text-white transition-colors">Features</a>
                <a href="#how" className="text-sm text-white/80 hover:text-white transition-colors">How It Works</a>
                <a href="#contact" className="text-sm text-white/80 hover:text-white transition-colors">Contact</a>
                <Link href="/price-levels" className="text-sm text-white/80 hover:text-white transition-colors">Pricing</Link>
                <Link href="/auth/login" className="text-sm text-white/80 hover:text-white transition-colors">Login</Link>
                <Link href="/auth/signup" className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-black shadow-sm transition hover:-translate-y-0.5 hover:opacity-90">Sign Up</Link>
              </div>

              {/* Mobile Menu Button */}
              <button id="menu-btn" className="relative z-50 flex flex-col justify-between w-6 h-5 focus:outline-none md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <span className="block w-full h-0.5 bg-white transition-all"></span>
                <span className="block w-full h-0.5 bg-white transition-all"></span>
                <span className="block w-full h-0.5 bg-white transition-all"></span>
              </button>

              {/* Mobile Menu */}
              {mobileMenuOpen && (
                <div className="fixed top-[80px] right-0 w-2/3 max-w-xs bg-black backdrop-blur border-l border-white/10 p-4 pt-6 rounded-bl-2xl md:hidden z-40">
                  <div className="flex flex-col text-center space-y-3">
                    <a href="#home" className="py-2 border-b border-white/20 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Home</a>
                    <a href="#services" className="py-2 border-b border-white/20 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Services</a>
                    <a href="#features" className="py-2 border-b border-white/20 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Features</a>
                    <a href="#how" className="py-2 border-b border-white/20 hover:text-white" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
                    <a href="#contact" className="py-2 border-b border-white/20 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Contact</a>
                    <Link href="/price-levels" className="py-2 border-b border-white/20 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
                    <Link href="/auth/login" className="py-2 border-b border-white/20 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                    <Link href="/auth/signup" className="mt-3 inline-block bg-white text-black font-medium px-4 py-2 rounded-md hover:opacity-90">Sign Up</Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section id="home" className="relative isolate bg-gray-50 text-black pb-8 md:pb-0">
          <div className="mx-auto max-w-7xl px-6 py-16 md:py-20 lg:py-28">
            <div className="grid items-center gap-20 md:grid-cols-2">
              <div>
                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-tight tracking-tight text-black">
                  Loans for Doctors & Engineers - <span className="font-sans">0</span>% Processing Fee
                </h1>
                <p className="mt-6 max-w-xl text-base text-gray-700 md:text-lg">
                  Empowering professionals with fast, transparent, and hassle-free financial support — access short-term credit with clarity, repay with ease, and move forward with confidence. No hidden charges. No processing fees.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a href="https://wa.me/919063909032" className="inline-flex items-center rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:opacity-90">Get Started</a>
                  <a href="#features" className="inline-flex items-center rounded-full border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition">Explore Features</a>
                </div>
                <p className="mt-6 max-w-xl text-xl text-gray-700 lg:text-3xl">
                  Finomaa Checks Discipline, not Cibil.
                </p>
              </div>
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden">
                <img src="/heroimage.jpg" alt="Finomaa Hero" className="w-full h-full object-cover rounded-2xl shadow-lg" />
              </div>
            </div>
          </div>
        </section>
      </header>

      <main>
        {/* Why Choose Section */}
        <section id="why" className="bg-white">
          <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl tracking-tight">Why Choose Finomaa?</h2>
              <p className="mt-4 text-base text-gray-600 md:text-lg">Designed with restraint, built for speed, and delivered with transparency.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { title: 'Quick processing', desc: 'From request to approval in minutes—time is a luxury.' },
                { title: 'Transparent terms', desc: 'Clarity at every step—no hidden surprises.' },
                { title: 'Flexible repayment', desc: 'Match repayments with how you actually live and work.' },
                { title: 'Trusted brand', desc: 'Discretion, reliability, and service at the core.' },
              ].map((item, idx) => (
                <div key={idx} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="mb-4 h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center text-lg">⚡</div>
                  <h3 className="font-serif text-xl">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="bg-gray-50">
          <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl tracking-tight">Our Services</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { title: 'Digital Payment Card', desc: 'Activate instantly and begin using your digital card within minutes.' },
                { title: 'Instant Credit', desc: 'Borrow short‑term amounts quickly, with elegant simplicity.' },
                { title: 'Behavioral Assessment', desc: 'Boost limits over time based on consistent, disciplined usage.' },
              ].map((item, idx) => (
                <div key={idx} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="mb-4 h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center text-lg">💳</div>
                  <h3 className="font-serif text-xl">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-white">
          <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl tracking-tight">Our Features</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { title: 'Smart Dashboard', desc: 'Clarity at a glance—balance, usage, repayment.' },
                { title: 'Instant Verification', desc: 'Authenticate employment and identity in moments.' },
                { title: '24/7 Support', desc: 'Responsive, discreet, and genuinely helpful.' },
                { title: 'Data Privacy', desc: 'Your data, handled with restraint and respect.' },
              ].map((item, idx) => (
                <div key={idx} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                  <h3 className="font-serif text-lg">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how" className="bg-gray-50">
          <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden">
                <img src="/works.png" alt="How It Works" className="w-full h-full object-cover rounded-2xl border border-gray-200" />
              </div>
              <div>
                <h2 className="font-serif text-3xl md:text-4xl tracking-tight">How It Works</h2>
                <ol className="mt-8 space-y-6">
                  {[
                    { num: '1', title: 'Sign Up', desc: 'Create your account in moments with essential details.' },
                    { num: '2', title: 'Verify Employment', desc: 'Instant checks keep the process swift and accurate.' },
                    { num: '3', title: 'Access Credit', desc: 'Use your approved line with clean, transparent terms.' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-800 flex-shrink-0">{item.num}</span>
                      <div>
                        <h3 className="font-serif text-lg">{item.title}</h3>
                        <p className="mt-1 text-sm text-gray-600">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="bg-white">
          <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <div className="flex items-center justify-center">
                <div className="relative h-64 w-64 rounded-2xl border border-gray-200 overflow-hidden">
                  <img src="/experts.jpg" alt="Expert" className="w-full h-full object-cover" />
                </div>
              </div>
              <div>
                <h2 className="font-serif text-3xl md:text-4xl tracking-tight">What Experts Say</h2>
                <p className="mt-6 text-gray-600 text-base md:text-lg">
                  "Finomaa simplifies access to short-term credit with complete transparency. Their process is quick, professional, and trustworthy—highly recommended for modern professionals seeking financial clarity."
                </p>
                <p className="mt-4 text-gray-800 font-medium">— Dr. Priya R., Financial Consultant</p>
              </div>
            </div>
          </div>
        </section>

        {/* Reach Section */}
        <section id="reach" className="bg-gray-50">
          <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl tracking-tight">Our Reach</h2>
              <p className="mt-4 text-base text-gray-600 md:text-lg">Empowering lives with impactful financial solutions.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { num: '120+', label: 'Happy Customers' },
                { num: '1.4 Cr', label: 'Capital Infused' },
                { num: '5+', label: 'Cities Expanded' },
              ].map((item, idx) => (
                <div key={idx} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md text-center">
                  <div className="mb-4 h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center mx-auto text-lg">📊</div>
                  <h3 className="font-bold text-2xl">{item.num}</h3>
                  <p className="mt-2 text-sm text-gray-600">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enterprise Features Section */}
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl tracking-tight">Enterprise Dashboard</h2>
              <p className="mt-4 text-base text-gray-600 md:text-lg">Complete control with advanced features for managing your financial profile, applications, and credit journey.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { title: 'Secure Authentication', desc: 'Login and manage your account with enterprise-grade security.' },
                { title: 'Application Tracking', desc: 'Real-time status updates on your loan applications.' },
                { title: 'Eligibility Checker', desc: 'Instant tier classification based on your profile.' },
                { title: 'Audit & Compliance', desc: 'Complete activity tracking for your peace of mind.' },
              ].map((item, idx) => (
                <div key={idx} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <h3 className="font-serif text-lg">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link href="/auth/signup" className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm md:text-base font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:opacity-90">
                Access Your Dashboard
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-black text-white">
          <div className="mx-auto max-w-7xl px-6 py-20 md:py-24 text-center">
            <h2 className="font-serif text-3xl md:text-5xl tracking-tight">Ready to Take Control of Your Finances?</h2>
            <p className="mt-6 text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
              Sign up today and access quick, transparent credit tailored for modern professionals. Minimal paperwork, instant verification, and complete clarity.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <a href="https://wa.me/919063909032" className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm md:text-base font-medium text-black shadow-sm transition hover:-translate-y-0.5 hover:opacity-90">
                Get Started
              </a>
              <Link href="/price-levels" className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-sm md:text-base font-medium text-white/90 hover:text-white hover:bg-white/10 transition">
                Check Pricing & Eligibility
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-black text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <a href="#home" className="flex items-center gap-3 text-white hover:opacity-80 transition">
                <div className="h-9 w-9 rounded-md bg-white/10 ring-1 ring-white/20 flex items-center justify-center overflow-hidden">
                  <img src="/banner.jpg" alt="Finomaa logo" className="h-full w-full object-cover" />
                </div>
                <div className="leading-tight">
                  <img src="/headingimage.jpg" alt="Finomaa Logo" className="h-6 w-auto" />
                  <span className="block text-xs text-white/70">Quick funds, Brighter tomorrow</span>
                </div>
              </a>
              <p className="mt-4 text-sm text-white/70 max-w-xs">
                Finomaa provides fast, transparent financial solutions for modern professionals.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#home" className="hover:text-white transition">Home</a></li>
                <li><a href="#services" className="hover:text-white transition">Services</a></li>
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#how" className="hover:text-white transition">How It Works</a></li>
                <li><Link href="/price-levels" className="hover:text-white transition">Pricing</Link></li>
                <li><Link href="/auth/login" className="hover:text-white transition">Login</Link></li>
                <li><Link href="/auth/signup" className="hover:text-white transition">Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-lg mb-4">Connect With Us</h3>
              <div className="flex items-center gap-4 mb-4">
                <a href="#" className="text-white/70 hover:text-white transition" aria-label="Twitter">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.5 11.24h-6.653l-5.214-6.82-5.967 6.82H1.682l7.73-8.838L1.25 2.25h6.82l4.713 6.231 5.46-6.231zm-1.163 18.52h1.834L7.084 3.63H5.117l11.964 17.14z"/></svg>
                </a>
                <a href="https://wa.me/919063909032" className="text-white/70 hover:text-white transition" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.768.966-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.72-1.654-2.017-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.612-.916-2.21-.242-.579-.487-.5-.67-.51-.173-.009-.372-.011-.571-.011-.198 0-.52.075-.793.372-.273.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.405h-.003a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.518-5.259c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.001 5.45-4.436 9.884-9.878 9.884zm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.158 11.892c0 2.096.547 4.142 1.588 5.944L.057 24l6.305-1.654a11.88 11.88 0 005.684 1.448h.005c6.554 0 11.89-5.335 11.892-11.893a11.82 11.82 0 00-3.474-8.403z"/></svg>
                </a>
                <a href="https://www.instagram.com/finomaafintech" className="text-white/70 hover:text-white transition" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.5-.5a1 1 0 110 2 1 1 0 010-2z"/></svg>
                </a>
              </div>
              <p className="text-sm text-white/70">Email: <a href="mailto:support@finomaa.com" className="hover:text-white">support@finomaa.com</a></p>
              <p className="text-sm text-white/70">Mobile: <a href="tel:+919063909032" className="hover:text-white">+91 90639 09032</a></p>
              <p className="text-sm text-white/70 mt-4">&copy; 2025 Finomaa. All rights reserved.</p>
              <p className="text-sm text-white/70">A venture of YOOMAA CAPITAL PVT LTD.</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
