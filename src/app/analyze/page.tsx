// app/analytics/page.tsx
'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCw, Download, Share2 } from 'lucide-react'
import KPIScoreCards from '../../components/analytics/KPIScoreCards'
import CategoryBreakdown from '../../components/analytics/CategoryBreakdown'
import TimeTrend from '../../components/analytics/TimeTrend'
import AnalyticsFilters from '../../components/analytics/AnalyticsFilters'
import DrillDownTable from '../../components/analytics/DrillDownTable'
import InsightsPanel from '../../components/analytics/InsightsPanel'
import { AnalyticsFilters as AFilters } from '../../types/analytics'
import { Transaction } from '../../types/transaction'
import { Budget } from '../../types/budget'
import { useAnalytics } from '../../hooks/useAnalytics'
import { format, subDays } from 'date-fns'

// Mock data - replace with actual API calls
const mockTransactions: Transaction[] = [
  // Add your mock transaction data here
]

const mockBudgets: Budget[] = [
  // Add your mock budget data here
]

export default function AnalyticsPage() {
  const [filters, setFilters] = useState<AFilters>({
    dateRange: {
      start: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
      end: format(new Date(), 'yyyy-MM-dd'),
      preset: 'month'
    },
    categories: [],
    merchants: [],
    amountRange: { min: null, max: null },
    transactionTypes: ['income', 'expense', 'transfer']
  })

  const { analyticsData, loading, error, refreshData } = useAnalytics(
    filters,
    mockTransactions,
    mockBudgets
  )

  const handleResetFilters = () => {
    setFilters({
      dateRange: {
        start: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
        end: format(new Date(), 'yyyy-MM-dd'),
        preset: 'month'
      },
      categories: [],
      merchants: [],
      amountRange: { min: null, max: null },
      transactionTypes: ['income', 'expense', 'transfer']
    })
  }

  const handleExportData = () => {
    // Implementation for exporting analytics data
    console.log('Exporting analytics data...')
  }

  const handleTransactionClick = (transaction: Transaction) => {
    // Navigate to transaction detail or open modal
    console.log('Transaction clicked:', transaction)
  }

  // Get unique categories and merchants for filters
  const availableCategories = Array.from(
    new Set(mockTransactions.map(t => ({ id: t.categoryId, name: t.category })))
  ).map(cat => ({ ...cat, color: '#3B82F6' })) // Mock color

  const availableMerchants = Array.from(
    new Set(mockTransactions.map(t => t.merchantId).filter(Boolean))
  ) as string[]

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Analytics</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={refreshData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Comprehensive insights into your financial patterns</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button onClick={refreshData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters */}
        <AnalyticsFilters
          filters={filters}
          onFiltersChange={setFilters}
          availableCategories={availableCategories}
          availableMerchants={availableMerchants}
          onReset={handleResetFilters}
        />

        {/* KPI Scorecards */}
        <KPIScoreCards 
          kpis={analyticsData?.kpis || {
            totalSpend: { current: 0, previous: 0, variance: 0, variancePercentage: 0 },
            averageTransaction: { current: 0, previous: 0, variance: 0 },
            largestTransaction: { amount: 0, merchant: '', date: '', category: '' },
            transactionCount: { current: 0, previous: 0 },
            budgetPerformance: { allocated: 0, spent: 0, remaining: 0, utilizationPercentage: 0 }
          }}
          loading={loading}
        />

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Category Breakdown - Takes 2 columns */}
          <div className="lg:col-span-2">
            <CategoryBreakdown 
              categories={analyticsData?.categoryBreakdown || []}
              loading={loading}
            />
          </div>
          
          {/* Time Trend - Takes 1 column */}
          <div className="lg:col-span-1">
            <TimeTrend 
              timeSeriesData={analyticsData?.timeSeriesData || []}
              loading={loading}
            />
          </div>
        </div>

        {/* Insights */}
        <InsightsPanel
          anomalies={analyticsData?.anomalies || []}
          insights={analyticsData?.insights || []}
          loading={loading}
        />

        {/* Drill-down Table */}
        <DrillDownTable
          transactions={mockTransactions.filter(t => {
            const transactionDate = new Date(t.date)
            const startDate = new Date(filters.dateRange.start)
            const endDate = new Date(filters.dateRange.end)
            return transactionDate >= startDate && transactionDate <= endDate
          })}
          loading={loading}
          onTransactionClick={handleTransactionClick}
        />
      </div>
    </div>
  )
}
