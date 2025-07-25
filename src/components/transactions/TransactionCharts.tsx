// components/transactions/TransactionCharts.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
} from 'chart.js';
import { Transaction } from '@/types/transaction';
import { format, subDays, startOfDay } from 'date-fns';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);

interface TransactionChartsProps {
  transactions: Transaction[];
}

const TransactionCharts: React.FC<TransactionChartsProps> = ({ transactions }) => {
  // Category breakdown for expenses
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const categoryChartData = {
    labels: Object.keys(expensesByCategory),
    datasets: [
      {
        data: Object.values(expensesByCategory),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
          '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
        ],
      },
    ],
  };

  // Monthly spending trend
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = subDays(new Date(), i * 30);
    return format(date, 'MMM yyyy');
  }).reverse();

  const monthlySpending = last6Months.map(month => {
    return transactions
      .filter(t => t.type === 'expense' && format(new Date(t.date), 'MMM yyyy') === month)
      .reduce((sum, t) => sum + t.amount, 0);
  });

  const trendChartData = {
    labels: last6Months,
    datasets: [
      {
        label: 'Monthly Spending',
        data: monthlySpending,
        borderColor: '#3B82F6',
        backgroundColor: '#3B82F620',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Income vs Expenses comparison
  const incomeVsExpenses = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        label: 'Amount',
        data: [
          transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
          transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
        ],
        backgroundColor: ['#10B981', '#EF4444'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <Doughnut data={categoryChartData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Income vs Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <Bar data={incomeVsExpenses} options={chartOptions} />
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Spending Trend (Last 6 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <Line data={trendChartData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionCharts;
