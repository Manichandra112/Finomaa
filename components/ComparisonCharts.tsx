'use client';

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ComparisonChartsProps {
  loanAmount: number;
}

export default function ComparisonCharts({ loanAmount }: ComparisonChartsProps) {
  // Interest rate comparison across tiers
  const tierComparison = [
    { name: 'Bronze', rate: 14, maxLoan: 3000000 },
    { name: 'Silver', rate: 12, maxLoan: 7500000 },
    { name: 'Gold', rate: 10, maxLoan: 15000000 },
    { name: 'Platinum', rate: 8, maxLoan: 30000000 },
  ];

  // EMI comparison for different tenures
  const calculateEMI = (principal: number, rate: number, months: number) => {
    const monthlyRate = rate / 100 / 12;
    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(emi);
  };

  const tenureComparison = [
    { tenure: 6, bronze: calculateEMI(loanAmount, 14, 6), silver: calculateEMI(loanAmount, 12, 6), gold: calculateEMI(loanAmount, 10, 6), platinum: calculateEMI(loanAmount, 8, 6) },
    { tenure: 12, bronze: calculateEMI(loanAmount, 14, 12), silver: calculateEMI(loanAmount, 12, 12), gold: calculateEMI(loanAmount, 10, 12), platinum: calculateEMI(loanAmount, 8, 12) },
    { tenure: 24, bronze: calculateEMI(loanAmount, 14, 24), silver: calculateEMI(loanAmount, 12, 24), gold: calculateEMI(loanAmount, 10, 24), platinum: calculateEMI(loanAmount, 8, 24) },
    { tenure: 36, bronze: calculateEMI(loanAmount, 14, 36), silver: calculateEMI(loanAmount, 12, 36), gold: calculateEMI(loanAmount, 10, 36), platinum: calculateEMI(loanAmount, 8, 36) },
  ];

  // Cost breakdown for Silver tier
  const silverEMI = calculateEMI(loanAmount, 12, 24);
  const totalPayment = silverEMI * 24;
  const totalInterest = totalPayment - loanAmount;

  const costBreakdown = [
    { name: 'Principal', value: loanAmount, color: 'hsl(var(--chart-1))' },
    { name: 'Interest', value: totalInterest, color: 'hsl(var(--chart-3))' },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-8">
      {/* Tier Comparison Chart */}
      <div className="card">
        <h3 className="heading-sm mb-4">Interest Rate by Tier</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={tierComparison}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--secondary)',
              }}
              formatter={(value) => `${value}%`}
            />
            <Bar dataKey="rate" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-sm text-muted-foreground mt-4">
          Lower interest rates are available for higher income brackets. Choose a tier that matches your salary.
        </p>
      </div>

      {/* EMI Comparison Chart */}
      <div className="card">
        <h3 className="heading-sm mb-4">Monthly EMI Comparison (Loan: {formatCurrency(loanAmount)})</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={tenureComparison}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" />
            <XAxis 
              dataKey="tenure" 
              label={{ value: 'Tenure (Months)', position: 'insideBottomRight', offset: -5 }}
            />
            <YAxis 
              label={{ value: 'Monthly EMI (₹)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--secondary)',
              }}
              formatter={(value) => formatCurrency(value as number)}
            />
            <Legend />
            <Line type="monotone" dataKey="bronze" stroke="hsl(0, 0%, 50%)" strokeWidth={2} name="Bronze (14%)" />
            <Line type="monotone" dataKey="silver" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Silver (12%)" />
            <Line type="monotone" dataKey="gold" stroke="hsl(var(--chart-2))" strokeWidth={2} name="Gold (10%)" />
            <Line type="monotone" dataKey="platinum" stroke="hsl(var(--chart-3))" strokeWidth={2} name="Platinum (8%)" />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-sm text-muted-foreground mt-4">
          As tenure increases, your monthly EMI decreases but total interest paid increases.
        </p>
      </div>

      {/* Cost Breakdown Pie Chart */}
      <div className="card">
        <h3 className="heading-sm mb-4">Cost Breakdown (Silver Tier, 24 Months)</h3>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="w-full lg:w-1/2">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={costBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {costBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full lg:w-1/2 space-y-4">
            <div className="bg-secondary p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Loan Amount</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(loanAmount)}</p>
            </div>
            <div className="bg-secondary p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Monthly EMI</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(silverEMI)}</p>
            </div>
            <div className="bg-secondary p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Total Interest (24M)</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(totalInterest)}</p>
            </div>
            <div className="bg-secondary p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Total Amount Payable</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(totalPayment)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
