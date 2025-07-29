// components/analytics/CategoryBreakdown.tsx
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { CategoryAnalytics } from '../../types/analytics'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

interface CategoryBreakdownProps {
  categories: CategoryAnalytics[]
  loading?: boolean
}

const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ categories, loading }) => {
  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-red-500" />
      case 'down': return <TrendingDown className="h-3 w-3 text-green-500" />
      default: return <Minus className="h-3 w-3 text-gray-500" />
    }
  }

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'text-red-500'
      case 'down': return 'text-green-500'
      default: return 'text-gray-500'
    }
  }

  // Pie chart data
  const pieData = {
    labels: categories.map(cat => cat.categoryName),
    datasets: [
      {
        data: categories.map(cat => cat.totalSpent),
        backgroundColor: categories.map(cat => cat.color),
        borderColor: categories.map(cat => cat.color),
        borderWidth: 2,
        hoverBorderWidth: 3,
      },
    ],
  }

  // Bar chart data (sorted by total spend)
  const sortedCategories = [...categories].sort((a, b) => b.totalSpent - a.totalSpent)
  const barData = {
    labels: sortedCategories.map(cat => cat.categoryName),
    datasets: [
      {
        label: 'Total Spent',
        data: sortedCategories.map(cat => cat.totalSpent),
        backgroundColor: sortedCategories.map(cat => `${cat.color}80`),
        borderColor: sortedCategories.map(cat => cat.color),
        borderWidth: 1,
        borderRadius: 4,
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
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.parsed || context.raw
            const total = categories.reduce((sum, cat) => sum + cat.totalSpent, 0)
            const percentage = ((value / total) * 100).toFixed(1)
            return `${context.label}: ${formatCurrency(value)} (${percentage}%)`
          },
        },
      },
    },
  }

  const barOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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
      x: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return formatCurrency(value)
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: 11,
          },
        },
      },
    },
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="h-80 bg-gray-200 rounded animate-pulse" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="h-80 bg-gray-200 rounded animate-pulse" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Doughnut data={pieData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Bar data={barData} options={barOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Category</th>
                  <th className="text-right py-2">Total Spent</th>
                  <th className="text-right py-2">% of Total</th>
                  <th className="text-right py-2">Avg/Transaction</th>
                  <th className="text-right py-2">Transactions</th>
                  <th className="text-right py-2">Trend</th>
                  <th className="text-right py-2">Budget</th>
                </tr>
              </thead>
              <tbody>
                {sortedCategories.map((category) => (
                  <tr key={category.categoryId} className="border-b hover:bg-gray-50">
                    <td className="py-3">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium">{category.categoryName}</span>
                      </div>
                    </td>
                    <td className="text-right font-semibold">
                      {formatCurrency(category.totalSpent)}
                    </td>
                    <td className="text-right text-muted-foreground">
                      {category.percentage.toFixed(1)}%
                    </td>
                    <td className="text-right text-muted-foreground">
                      {formatCurrency(category.averageAmount)}
                    </td>
                    <td className="text-right text-muted-foreground">
                      {category.transactionCount}
                    </td>
                    <td className="text-right">
                      <div className={`flex items-center justify-end space-x-1 ${getTrendColor(category.trend)}`}>
                        {getTrendIcon(category.trend)}
                        <span className="text-xs">
                          {category.trendPercentage !== 0 && `${category.trendPercentage.toFixed(1)}%`}
                        </span>
                      </div>
                    </td>
                    <td className="text-right">
                      {category.budgetAllocated ? (
                        <div className="space-y-1">
                          <div className="text-sm">{formatCurrency(category.budgetAllocated)}</div>
                          {category.budgetVariance !== undefined && (
                            <Badge 
                              variant={category.budgetVariance > 0 ? "destructive" : "secondary"}
                              className="text-xs"
                            >
                              {category.budgetVariance > 0 ? 'Over' : 'Under'} 
                              {formatCurrency(Math.abs(category.budgetVariance))}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">No budget</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CategoryBreakdown
