// components/analytics/KPIScoreCards.tsx
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calculator, 
  Receipt, 
  Target,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react'
import { AnalyticsKPI } from '../../types/analytics'

interface KPIScoreCardsProps {
  kpis: AnalyticsKPI
  loading?: boolean
}

const KPIScoreCards: React.FC<KPIScoreCardsProps> = ({ kpis, loading }) => {
  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

  const formatPercentage = (percentage: number) => 
    `${percentage >= 0 ? '+' : ''}${percentage.toFixed(1)}%`

  const getVarianceIcon = (variance: number) => {
    if (variance > 0) return <ArrowUp className="h-3 w-3" />
    if (variance < 0) return <ArrowDown className="h-3 w-3" />
    return <Minus className="h-3 w-3" />
  }

  const getVarianceColor = (variance: number, isExpense: boolean = true) => {
    if (variance === 0) return 'text-gray-600'
    // For expenses: increase is bad (red), decrease is good (green)
    // For income: increase is good (green), decrease is bad (red)
    if (isExpense) {
      return variance > 0 ? 'text-red-600' : 'text-green-600'
    }
    return variance > 0 ? 'text-green-600' : 'text-red-600'
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-8 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Spend */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(kpis.totalSpend.current)}</div>
          <div className="flex items-center space-x-1 text-xs">
            <div className={`flex items-center space-x-1 ${getVarianceColor(kpis.totalSpend.variancePercentage, true)}`}>
              {getVarianceIcon(kpis.totalSpend.variancePercentage)}
              <span>{formatPercentage(kpis.totalSpend.variancePercentage)}</span>
            </div>
            <span className="text-muted-foreground">vs last period</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Previous: {formatCurrency(kpis.totalSpend.previous)}
          </div>
        </CardContent>
      </Card>

      {/* Average Transaction */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Transaction</CardTitle>
          <Calculator className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(kpis.averageTransaction.current)}</div>
          <div className="flex items-center space-x-1 text-xs">
            <div className={`flex items-center space-x-1 ${getVarianceColor(kpis.averageTransaction.variance, true)}`}>
              {getVarianceIcon(kpis.averageTransaction.variance)}
              <span>{formatCurrency(Math.abs(kpis.averageTransaction.variance))}</span>
            </div>
            <span className="text-muted-foreground">vs last period</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {kpis.transactionCount.current} transactions
          </div>
        </CardContent>
      </Card>

      {/* Largest Transaction */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Largest Transaction</CardTitle>
          <Receipt className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(kpis.largestTransaction.amount)}</div>
          <div className="text-xs text-muted-foreground truncate">
            {kpis.largestTransaction.merchant}
          </div>
          <div className="flex items-center justify-between mt-1">
            <Badge variant="secondary" className="text-xs">
              {kpis.largestTransaction.category}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {new Date(kpis.largestTransaction.date).toLocaleDateString()}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Budget Performance */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Budget Performance</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {kpis.budgetPerformance.utilizationPercentage.toFixed(0)}%
          </div>
          <div className="text-xs text-muted-foreground">
            {formatCurrency(kpis.budgetPerformance.spent)} of {formatCurrency(kpis.budgetPerformance.allocated)}
          </div>
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span>Utilized</span>
              <span>{kpis.budgetPerformance.utilizationPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  kpis.budgetPerformance.utilizationPercentage > 100 ? 'bg-red-500' :
                  kpis.budgetPerformance.utilizationPercentage > 80 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${Math.min(100, kpis.budgetPerformance.utilizationPercentage)}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default KPIScoreCards
