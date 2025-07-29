// hooks/useAnalytics.ts
import { useState, useEffect, useMemo } from 'react'
import { AnalyticsData, AnalyticsFilters } from '../types/analytics'
import { Transaction } from '../types/transaction'
import { Budget } from '../types/budget'

interface UseAnalyticsResult {
  analyticsData: AnalyticsData | null
  loading: boolean
  error: string | null
  refreshData: () => void
}

export const useAnalytics = (
  filters: AnalyticsFilters,
  transactions: Transaction[],
  budgets: Budget[]
): UseAnalyticsResult => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const processAnalyticsData = async (): Promise<AnalyticsData> => {
    // Filter transactions based on filters
    const filteredTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date)
      const startDate = new Date(filters.dateRange.start)
      const endDate = new Date(filters.dateRange.end)

      if (transactionDate < startDate || transactionDate > endDate) return false
      if (filters.categories.length > 0 && !filters.categories.includes(transaction.categoryId)) return false
      if (filters.merchants.length > 0 && !filters.merchants.includes(transaction.merchantId || '')) return false
      if (!filters.transactionTypes.includes(transaction.type)) return false
      
      if (filters.amountRange.min !== null && Math.abs(transaction.amount) < filters.amountRange.min) return false
      if (filters.amountRange.max !== null && Math.abs(transaction.amount) > filters.amountRange.max) return false

      return true
    })

    // Calculate KPIs
    const expenses = filteredTransactions.filter(t => t.type === 'expense')
    const totalSpend = expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0)
    
    // Mock previous period calculation (you would implement proper date logic)
    const previousSpend = totalSpend * 0.9 // Mock 10% less
    const averageTransaction = expenses.length > 0 ? totalSpend / expenses.length : 0
    const previousAverage = averageTransaction * 0.95 // Mock 5% less
    
    const largestTransaction = expenses.reduce((max, t) => 
      Math.abs(t.amount) > Math.abs(max.amount) ? t : max, expenses[0] || { amount: 0, merchant: '', date: '', category: '' }
    )

    // Get active budget
    const activeBudget = budgets.find(b => b.isActive)
    const budgetAllocated = activeBudget?.categories.reduce((sum, c) => sum + c.allocated, 0) || 0
    const budgetSpent = activeBudget?.categories.reduce((sum, c) => sum + c.spent, 0) || 0

    const kpis = {
      totalSpend: {
        current: totalSpend,
        previous: previousSpend,
        variance: totalSpend - previousSpend,
        variancePercentage: previousSpend > 0 ? ((totalSpend - previousSpend) / previousSpend) * 100 : 0
      },
      averageTransaction: {
        current: averageTransaction,
        previous: previousAverage,
        variance: averageTransaction - previousAverage
      },
      largestTransaction: {
        amount: Math.abs(largestTransaction?.amount || 0),
        merchant: largestTransaction?.merchantId || '',
        date: largestTransaction?.date || '',
        category: largestTransaction?.category || ''
      },
      transactionCount: {
        current: expenses.length,
        previous: Math.floor(expenses.length * 0.9) // Mock
      },
      budgetPerformance: {
        allocated: budgetAllocated,
        spent: budgetSpent,
        remaining: budgetAllocated - budgetSpent,
        utilizationPercentage: budgetAllocated > 0 ? (budgetSpent / budgetAllocated) * 100 : 0
      }
    }

    // Calculate category breakdown
    const categorySpending = expenses.reduce((acc, transaction) => {
      const category = transaction.category
      if (!acc[category]) {
        acc[category] = {
          categoryId: transaction.categoryId,
          categoryName: category,
          totalSpent: 0,
          transactionCount: 0,
          amounts: []
        }
      }
      acc[category].totalSpent += Math.abs(transaction.amount)
      acc[category].transactionCount += 1
      acc[category].amounts.push(Math.abs(transaction.amount))
      return acc
    }, {} as any)

    const categoryBreakdown = Object.values(categorySpending).map((cat: any) => ({
      categoryId: cat.categoryId,
      categoryName: cat.categoryName,
      totalSpent: cat.totalSpent,
      percentage: (cat.totalSpent / totalSpend) * 100,
      transactionCount: cat.transactionCount,
      averageAmount: cat.totalSpent / cat.transactionCount,
      budgetAllocated: activeBudget?.categories.find(c => c.name === cat.categoryName)?.allocated,
      budgetVariance: activeBudget?.categories.find(c => c.name === cat.categoryName)?.allocated 
        ? cat.totalSpent - (activeBudget?.categories.find(c => c.name === cat.categoryName)?.allocated || 0)
        : undefined,
      color: getRandomColor(), // You'd implement proper color mapping
      trend: Math.random() > 0.5 ? 'up' : 'down' as 'up' | 'down', // Mock trend
      trendPercentage: (Math.random() - 0.5) * 20 // Mock percentage
    }))

    // Generate time series data
    const timeSeriesData = generateTimeSeriesData(filteredTransactions, filters.dateRange)

    // Generate mock anomalies and insights
    const anomalies = generateMockAnomalies(filteredTransactions, categoryBreakdown)
    const insights = generateMockInsights(kpis, categoryBreakdown)

    // Top merchants
    const merchantSpending = expenses.reduce((acc, t) => {
      const merchant = t.merchantId || 'Unknown'
      if (!acc[merchant]) {
        acc[merchant] = { totalSpent: 0, transactionCount: 0, category: t.category }
      }
      acc[merchant].totalSpent += Math.abs(t.amount)
      acc[merchant].transactionCount += 1
      return acc
    }, {} as any)

    const topMerchants = Object.entries(merchantSpending)
      .map(([name, data]: [string, any]) => ({ name, ...data }))
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10)

    return {
      kpis,
      categoryBreakdown,
      timeSeriesData,
      anomalies,
      insights,
      topMerchants
    }
  }

  const refreshData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await processAnalyticsData()
      setAnalyticsData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error processing analytics data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshData()
  }, [filters, transactions, budgets])

  return {
    analyticsData,
    loading,
    error,
    refreshData
  }
}

// Helper functions
const getRandomColor = () => {
  const colors = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16', '#F97316']
  return colors[Math.floor(Math.random() * colors.length)]
}

const generateTimeSeriesData = (transactions: Transaction[], dateRange: any) => {
  // Implementation for generating time series data
  // This would group transactions by date and calculate daily/weekly totals
  const data = []
  const start = new Date(dateRange.start)
  const end = new Date(dateRange.end)
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dayTransactions = transactions.filter(t => 
      new Date(t.date).toDateString() === d.toDateString()
    )
    
    const income = dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
    const expenses = dayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0)
    
    data.push({
      date: d.toISOString().split('T')[0],
      income,
      expenses,
      netAmount: income - expenses,
      budgetSpent: expenses, // Mock
      budgetRemaining: Math.max(0, 100 - expenses) // Mock
    })
  }
  
  return data
}

const generateMockAnomalies = (transactions: Transaction[], categories: any[]) => {
  // Mock anomaly detection logic
  return [
    {
      id: '1',
      type: 'unusual_amount' as const,
      severity: 'high' as const,
      title: 'Unusually Large Purchase',
      description: 'A purchase of $450 at Electronics Store is 3x your typical spending',
      amount: 450,
      category: 'Shopping',
      date: new Date().toISOString(),
      suggestion: 'Consider if this was a planned purchase or review your shopping budget'
    }
  ]
}

const generateMockInsights = (kpis: any, categories: any[]) => {
  // Mock insights generation logic
  return [
    {
      id: '1',
      type: 'trend' as const,
      title: 'Grocery spending trending up',
      description: 'Your grocery spending has increased by 15% compared to last month',
      impact: 'negative' as const,
      actionRequired: false,
      suggestion: 'Consider meal planning or looking for better deals to optimize spending'
    },
    {
      id: '2',
      type: 'savings_opportunity' as const,
      title: 'Potential savings opportunity',
      description: 'You could save $200/month by optimizing subscription services',
      impact: 'positive' as const,
      actionRequired: true,
      suggestion: 'Review and cancel unused subscriptions'
    }
  ]
}
