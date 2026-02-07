'use client';

import Link from 'next/link';
import { ArrowRight, TrendingUp, BarChart3, Shield, Zap } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-secondary">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-lg font-bold text-primary">Finomaa</span>
          </div>
          <Link href="/price-levels" className="btn-primary bg-accent text-white hover:opacity-90">
            Explore Pricing
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-secondary px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-accent"></span>
              <span className="text-sm font-semibold text-foreground">Transparent Lending Made Simple</span>
            </div>
            <h1 className="heading-lg mb-6 max-w-3xl mx-auto">
              Quick Funds with Transparent Pricing
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover your eligibility, explore flexible loan tiers, and see exactly how much you'll pay with our real-time pricing calculator and detailed repayment schedules.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/price-levels" className="btn-primary bg-primary text-white">
                Check Your Eligibility
                <ArrowRight className="w-4 h-4 inline-block ml-2" />
              </Link>
              <button className="btn-secondary">
                Learn More
              </button>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="mt-20 grid gap-6 md:grid-cols-3 lg:grid-cols-4">
            {[
              { label: 'Max Loan Amount', value: '₹3 Cr', color: 'bg-blue-50' },
              { label: 'Tenure Options', value: '6-60 M', color: 'bg-green-50' },
              { label: 'Interest Rates', value: '8-14%', color: 'bg-orange-50' },
              { label: 'Approval Speed', value: '< 24 hrs', color: 'bg-purple-50' },
            ].map((stat, idx) => (
              <div key={idx} className={`${stat.color} rounded-lg p-6 text-center`}>
                <p className="text-sm font-semibold text-muted-foreground mb-2">{stat.label}</p>
                <p className="text-2xl font-bold text-primary">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-secondary py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="heading-md text-center mb-12">Why Choose Finomaa?</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: TrendingUp,
                title: 'Real-time Calculator',
                description: 'See instant EMI calculations and repayment schedules based on your loan amount and tenure.',
              },
              {
                icon: BarChart3,
                title: 'Transparent Pricing',
                description: 'No hidden charges. Clear tier-based pricing with detailed cost breakdowns for every loan.',
              },
              {
                icon: Shield,
                title: 'Eligibility Checker',
                description: 'Instantly know which pricing tier you qualify for based on your annual salary.',
              },
              {
                icon: Zap,
                title: 'Fast Approval',
                description: 'Get approved in less than 24 hours with our streamlined digital process.',
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="card">
                  <Icon className="w-8 h-8 text-accent mb-4" />
                  <h3 className="heading-sm mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="heading-md text-center mb-4">Flexible Loan Tiers</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Choose the tier that matches your financial profile. Get better interest rates as you move up the tiers.
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { name: 'Bronze', rate: '14%', max: '₹30L', salary: '₹3-6L' },
              { name: 'Silver', rate: '12%', max: '₹75L', salary: '₹6-15L', highlighted: true },
              { name: 'Gold', rate: '10%', max: '₹1.5Cr', salary: '₹15-30L' },
              { name: 'Platinum', rate: '8%', max: '₹3Cr', salary: '₹30L+' },
            ].map((tier, idx) => (
              <div
                key={idx}
                className={`card text-center transition-all ${
                  tier.highlighted ? 'border-accent border-2 shadow-lg' : ''
                }`}
              >
                <h3 className="heading-sm mb-2">{tier.name}</h3>
                <p className="text-3xl font-bold text-primary mb-4">{tier.rate}</p>
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <p>Annual Salary: {tier.salary}</p>
                  <p>Max Loan: {tier.max}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/price-levels" className="btn-primary bg-accent text-white hover:opacity-90">
              View All Tiers & Compare
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="heading-md mb-4">Ready to Explore Your Options?</h2>
          <p className="text-lg mb-8 opacity-90">
            Check your eligibility and discover the loan amount that suits your needs. It takes just a few seconds.
          </p>
          <Link href="/price-levels" className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-secondary transition-colors">
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-secondary bg-white py-8">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-muted-foreground">
          <p>© 2026 Finomaa. All rights reserved. Quietly powerful finance.</p>
        </div>
      </footer>
    </main>
  );
}
