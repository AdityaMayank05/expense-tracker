// components/budget/IncomeAllocationChart.tsx
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Doughnut, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js'
import { BudgetCategory } from '../../types/budget'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

interface IncomeAllocationChartProps {
  categories: BudgetCategory[]
  totalIncome: number
}

const IncomeAllocationChart: React.FC<IncomeAllocationChartProps> = ({
  categories,
  totalIncome
}) => {
  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

  const getPercentage = (amount: number) => 
    totalIncome > 0 ? ((amount / totalIncome) * 100).toFixed(1) : '0.0'

  // Doughnut chart data
  const doughnutData = {
    labels: [...categories.map(cat => cat.name), 'Unallocated'],
    datasets: [
      {
        data: [
          ...categories.map(cat => cat.allocated),
          Math.max(0, totalIncome - categories.reduce((sum, cat) => sum + cat.allocated, 0))
        ],
        backgroundColor: [
          ...categories.map(cat => cat.color),
          '#E5E7EB'
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  }

  // Bar chart data for category comparison
  const barData = {
    labels: categories.map(cat => cat.name),
    datasets: [
      {
        label: 'Allocated',
        data: categories.map(cat => cat.allocated),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
      {
        label: 'Spent',
        data: categories.map(cat => cat.spent),
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.parsed || context.raw
            return `${context.label}: ${formatCurrency(value)} (${getPercentage(value)}%)`
          },
        },
      },
    },
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${formatCurrency(context.raw)}`
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return formatCurrency(value)
          },
        },
      },
    },
  }

  // Group categories by type for summary
  const categoryGroups = categories.reduce((acc, cat) => {
    if (!acc[cat.type]) {
      acc[cat.type] = { allocated: 0, count: 0 }
    }
    acc[cat.type].allocated += cat.allocated
    acc[cat.type].count += 1
    return acc
  }, {} as Record<string, { allocated: number; count: number }>)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Income Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <Doughnut data={doughnutData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Budget vs Spending</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <Bar data={barData} options={barOptions} />
          </div>
        </CardContent>
      </Card>

      {/* Summary by Type */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Allocation Summary by Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(categoryGroups).map(([type, data]) => (
              <div key={type} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold capitalize">{type}</div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(data.allocated)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {getPercentage(data.allocated)}% of income
                </div>
                <div className="text-xs text-muted-foreground">
                  {data.count} categories
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default IncomeAllocationChart
