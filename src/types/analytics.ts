// types/analytics.ts

export interface AnalyticsKPI {
  totalSpend: {
    current: number
    previous: number
    variance: number
    variancePercentage: number
  }
  averageTransaction: {
    current: number
    previous: number
    variance: number
  }
  largestTransaction: {
    amount: number
    merchant: string
    date: string
    category: string
  }
  transactionCount: {
    current: number
    previous: number
  }
  budgetPerformance: {
    allocated: number
    spent: number
    remaining: number
    utilizationPercentage: number
  }
}

export interface CategoryAnalytics {
  categoryId: string
  categoryName: string
  totalSpent: number
  percentage: number
  transactionCount: number
  averageAmount: number
  budgetAllocated?: number
  budgetVariance?: number
  color: string
  trend: 'up' | 'down' | 'stable'
  trendPercentage: number
}

export interface TimeSeriesData {
  date: string
  income: number
  expenses: number
  netAmount: number
  budgetSpent?: number
  budgetRemaining?: number
}

export interface SpendingAnomaly {
  id: string
  type: 'unusual_amount' | 'budget_overrun' | 'category_spike' | 'merchant_frequency'
  severity: 'low' | 'medium' | 'high'
  title: string
  description: string
  amount?: number
  category?: string
  date: string
  suggestion?: string
}

export interface AnalyticsInsight {
  id: string
  type: 'trend' | 'budget' | 'category' | 'savings_opportunity'
  title: string
  description: string
  impact: 'positive' | 'negative' | 'neutral'
  actionRequired: boolean
  suggestion?: string
}

export interface AnalyticsFilters {
  dateRange: {
    start: string
    end: string
    preset: 'week' | 'month' | 'quarter' | 'year' | 'custom'
  }
  categories: string[]
  merchants: string[]
  amountRange: {
    min: number | null
    max: number | null
  }
  transactionTypes: ('income' | 'expense' | 'transfer')[]
}

export interface AnalyticsData {
  kpis: AnalyticsKPI
  categoryBreakdown: CategoryAnalytics[]
  timeSeriesData: TimeSeriesData[]
  anomalies: SpendingAnomaly[]
  insights: AnalyticsInsight[]
  topMerchants: Array<{
    name: string
    totalSpent: number
    transactionCount: number
    category: string
  }>
}
