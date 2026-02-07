'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RepaymentScheduleProps {
  loanData: {
    amount: number;
    tenure: number;
    interestRate: number;
  };
}

export default function RepaymentSchedule({ loanData }: RepaymentScheduleProps) {
  const [showTable, setShowTable] = useState(false);

  const calculateSchedule = () => {
    const monthlyRate = loanData.interestRate / 100 / 12;
    const emi =
      (loanData.amount *
        monthlyRate *
        Math.pow(1 + monthlyRate, loanData.tenure)) /
      (Math.pow(1 + monthlyRate, loanData.tenure) - 1);

    const schedule = [];
    let balance = loanData.amount;

    for (let month = 1; month <= loanData.tenure; month++) {
      const interest = balance * monthlyRate;
      const principal = emi - interest;
      balance -= principal;

      schedule.push({
        month,
        emi: Math.round(emi),
        principal: Math.round(principal),
        interest: Math.round(interest),
        balance: Math.max(0, Math.round(balance)),
      });
    }

    return { schedule, totalEMI: Math.round(emi) };
  };

  const { schedule, totalEMI } = calculateSchedule();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const totalPaid = totalEMI * loanData.tenure;
  const totalInterest = totalPaid - loanData.amount;

  // Chart data (show every 3rd month for clarity)
  const chartData = schedule.filter((item) => item.month % 3 === 0 || item.month === 1);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="card bg-blue-50 border-blue-200">
          <p className="text-xs font-semibold text-blue-600 mb-1">LOAN AMOUNT</p>
          <p className="text-2xl font-bold text-blue-900">{formatCurrency(loanData.amount)}</p>
        </div>
        <div className="card bg-orange-50 border-orange-200">
          <p className="text-xs font-semibold text-orange-600 mb-1">MONTHLY EMI</p>
          <p className="text-2xl font-bold text-orange-900">{formatCurrency(totalEMI)}</p>
        </div>
        <div className="card bg-red-50 border-red-200">
          <p className="text-xs font-semibold text-red-600 mb-1">TOTAL INTEREST</p>
          <p className="text-2xl font-bold text-red-900">{formatCurrency(totalInterest)}</p>
        </div>
        <div className="card bg-green-50 border-green-200">
          <p className="text-xs font-semibold text-green-600 mb-1">TOTAL PAYABLE</p>
          <p className="text-2xl font-bold text-green-900">{formatCurrency(totalPaid)}</p>
        </div>
      </div>

      {/* Balance Reduction Chart */}
      <div className="card">
        <h3 className="heading-sm mb-4">Loan Balance Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" />
            <XAxis
              dataKey="month"
              label={{ value: 'Month', position: 'insideBottomRight', offset: -5 }}
            />
            <YAxis
              label={{ value: 'Balance (₹)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--secondary)',
              }}
              formatter={(value) => formatCurrency(value as number)}
            />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="hsl(var(--chart-1))"
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--chart-1))', r: 5 }}
              name="Remaining Balance"
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-sm text-muted-foreground mt-4">
          Your loan balance decreases with each payment. The chart shows the outstanding balance after each EMI.
        </p>
      </div>

      {/* Schedule Table Toggle */}
      <div className="card">
        <button
          onClick={() => setShowTable(!showTable)}
          className="w-full py-3 px-4 bg-secondary hover:bg-muted rounded-lg font-semibold transition-colors text-left flex items-center justify-between"
        >
          <span>{showTable ? 'Hide' : 'View'} Detailed Payment Schedule</span>
          <span className={`transition-transform ${showTable ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {showTable && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b-2 border-secondary">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold text-muted-foreground">Month</th>
                  <th className="py-3 px-4 text-right font-semibold text-muted-foreground">EMI</th>
                  <th className="py-3 px-4 text-right font-semibold text-muted-foreground">Principal</th>
                  <th className="py-3 px-4 text-right font-semibold text-muted-foreground">Interest</th>
                  <th className="py-3 px-4 text-right font-semibold text-muted-foreground">Balance</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((item, idx) => (
                  <tr
                    key={idx}
                    className={`border-b border-secondary hover:bg-secondary transition-colors ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-secondary/50'
                    }`}
                  >
                    <td className="py-3 px-4 font-semibold">{item.month}</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(item.emi)}</td>
                    <td className="py-3 px-4 text-right text-blue-600">{formatCurrency(item.principal)}</td>
                    <td className="py-3 px-4 text-right text-red-600">{formatCurrency(item.interest)}</td>
                    <td className="py-3 px-4 text-right font-semibold">{formatCurrency(item.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 pt-4 border-t-2 border-secondary grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Total Principal Paid</p>
                <p className="text-lg font-bold">{formatCurrency(loanData.amount)}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Total Interest Paid</p>
                <p className="text-lg font-bold">{formatCurrency(totalInterest)}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Key Takeaways */}
      <div className="card bg-accent/5 border-accent/20">
        <h3 className="heading-sm mb-4 text-accent">Key Takeaways</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex gap-3">
            <span className="text-accent font-bold">•</span>
            <span>Your monthly EMI remains constant at <strong>{formatCurrency(totalEMI)}</strong> throughout the loan tenure.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent font-bold">•</span>
            <span>In the early months, more of your EMI goes towards interest. As time progresses, more goes towards principal.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent font-bold">•</span>
            <span>Total interest payable is <strong>{formatCurrency(totalInterest)}</strong>, which is {((totalInterest / loanData.amount) * 100).toFixed(1)}% of your loan amount.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent font-bold">•</span>
            <span>Early repayment may reduce your total interest burden. Check with our support team for prepayment options.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
