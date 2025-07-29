// components/analytics/TimeTrend.tsx
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react'
import { TimeSeriesData } from '../../types/analytics'
import { format } from 'date-fns'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface TimeTrendProps {
  timeSeriesData: TimeSeriesData[]
  loading?: boolean
}

const TimeTrend: React.FC<TimeTrendProps> = ({ timeSeriesData, loading }) => {
  const [viewMode, setViewMode] = useState<'expenses' | 'income_vs_expenses' | 'budget_progress'>('expenses')

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

  const getChartData = () => {
    const labels = timeSeriesData.map(data => format(new Date(data.date), 'MMM dd'))

    switch (viewMode) {
      case 'income_vs_expenses':
        return {
          labels,
          datasets: [
            {
              label: 'Income',
              data: timeSeriesData.map(data => data.income),
              borderColor: '#10B981',
              backgroundColor: '#10B98120',
              borderWidth: 3,
              fill: false,
              tension: 0.4,
              pointBackgroundColor: '#10B981',
              pointBorderColor: '#ffffff',
              pointBorderWidth: 2,
              pointRadius: 4,
            },
            {
              label: 'Expenses',
              data: timeSeriesData.map(data => data.expenses),
              borderColor: '#EF4444',
              backgroundColor: '#EF444420',
              borderWidth: 3,
              fill: false,
              tension: 0.4,
              pointBackgroundColor: '#EF4444',
              pointBorderColor: '#ffffff',
              pointBorderWidth: 2,
              pointRadius: 4,
            },
            {
              label: 'Net Amount',
              data: timeSeriesData.map(data => data.netAmount),
              borderColor: '#3B82F6',
              backgroundColor: '#3B82F620',
              borderWidth: 2,
              fill: true,
              tension: 0.4,
              pointBackgroundColor: '#3B82F6',
              pointBorderColor: '#ffffff',
              pointBorderWidth: 2,
              pointRadius: 3,
            },
          ],
        }

      case 'budget_progress':
        return {
          labels,
          datasets: [
            {
              label: 'Budget Allocated',
              data: timeSeriesData.map(data => (data.budgetSpent || 0) + (data.budgetRemaining || 0)),
              borderColor: '#6B7280',
              backgroundColor: '#6B728020',
              borderWidth: 2,
              borderDash: [5, 5],
              fill: false,
              tension: 0.4,
              pointBackgroundColor: '#6B7280',
              pointRadius: 3,
            },
            {
              label: 'Budget Spent',
              data: timeSeriesData.map(data => data.budgetSpent || 0),
              borderColor: '#F59E0B',
              backgroundColor: '#F59E0B20',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
              pointBackgroundColor: '#F59E0B',
              pointBorderColor: '#ffffff',
              pointBorderWidth: 2,
              pointRadius: 4,
            },
            {
              label: 'Actual Expenses',
              data: timeSeriesData.map(data => data.expenses),
              borderColor: '#EF4444',
              backgroundColor: 'transparent',
              borderWidth: 3,
              fill: false,
              tension: 0.4,
              pointBackgroundColor: '#EF4444',
              pointBorderColor: '#ffffff',
              pointBorderWidth: 2,
              pointRadius: 4,
            },
          ],
        }

      default: // expenses
        return {
          labels,
          datasets: [
            {
              label: 'Daily Expenses',
              data: timeSeriesData.map(data => data.expenses),
              borderColor: '#3B82F6',
              backgroundColor: '#3B82F620',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
              pointBackgroundColor: '#3B82F6',
              pointBorderColor: '#ffffff',
              pointBorderWidth: 2,
              pointRadius: 5,
              pointHoverRadius: 7,
            },
          ],
        }
    }
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${formatCurrency(context.raw)}`
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
        ticks: {
          color: '#6B7280',
          callback: function(value: any) {
            return formatCurrency(value)
          },
        },
      },
    },
  }

  // Calculate trend statistics
  const calculateTrend = () => {
    if (timeSeriesData.length < 2) return null

    const recent = timeSeriesData.slice(-7) // Last 7 days
    const previous = timeSeriesData.slice(-14, -7) // Previous 7 days

    const recentAvg = recent.reduce((sum, d) => sum + d.expenses, 0) / recent.length
    const previousAvg = previous.reduce((sum, d) => sum + d.expenses, 0) / previous.length

    const change = recentAvg - previousAvg
    const changePercentage = previousAvg > 0 ? (change / previousAvg) * 100 : 0

    return {
      change,
      changePercentage,
      recentAvg,
      previousAvg,
    }
  }

  const trend = calculateTrend()

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-gray-200 rounded animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Spending Trends</span>
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'expenses' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('expenses')}
            >
              Expenses
            </Button>
            <Button
              variant={viewMode === 'income_vs_expenses' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('income_vs_expenses')}
            >
              Income vs Expenses
            </Button>
            <Button
              variant={viewMode === 'budget_progress' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('budget_progress')}
            >
              Budget Progress
            </Button>
          </div>
        </div>

        {/* Trend Summary */}
        {trend && (
          <div className="flex items-center space-x-4 text-sm">
            <div className={`flex items-center space-x-1 ${
              trend.changePercentage > 0 ? 'text-red-600' : 'text-green-600'
            }`}>
              {trend.changePercentage > 0 ? 
                <TrendingUp className="h-4 w-4" /> : 
                <TrendingDown className="h-4 w-4" />
              }
              <span>
                {Math.abs(trend.changePercentage).toFixed(1)}% vs previous week
              </span>
            </div>
            <div className="text-muted-foreground">
              Recent avg: {formatCurrency(trend.recentAvg)}
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <Line data={getChartData()} options={chartOptions} />
        </div>
      </CardContent>
    </Card>
  )
}

export default TimeTrend
