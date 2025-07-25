// components/budget/BudgetPeriodSelector.tsx
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar, Clock } from 'lucide-react'
import { BudgetSettings } from '../../types/budget'

interface BudgetPeriodSelectorProps {
  settings: BudgetSettings
  onSettingsChange: (settings: BudgetSettings) => void
}

const BudgetPeriodSelector: React.FC<BudgetPeriodSelectorProps> = ({
  settings,
  onSettingsChange
}) => {
  const handlePeriodChange = (periodType: string) => {
    const now = new Date()
    let endDate = new Date()
    
    switch (periodType) {
      case 'weekly':
        endDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        break
      case 'bi-weekly':
        endDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)
        break
      case 'monthly':
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate())
        break
      case 'quarterly':
        endDate = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate())
        break
      case 'yearly':
        endDate = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())
        break
    }

    onSettingsChange({
      ...settings,
      period: {
        type: periodType as any,
        startDate: now,
        endDate
      }
    })
  }

  const handleIncomeChange = (income: string) => {
    const amount = parseFloat(income) || 0
    onSettingsChange({
      ...settings,
      totalIncome: amount
    })
  }

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

  const getPeriodDays = () => {
    const diff = settings.period.endDate.getTime() - settings.period.startDate.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  const getPerPeriodIncome = () => {
    const days = getPeriodDays()
    switch (settings.period.type) {
      case 'weekly': return settings.totalIncome / 4.33 // avg weeks per month
      case 'bi-weekly': return settings.totalIncome / 2.16 // avg bi-weeks per month
      case 'monthly': return settings.totalIncome
      case 'quarterly': return settings.totalIncome * 3
      case 'yearly': return settings.totalIncome * 12
      default: return settings.totalIncome
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Budget Period</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="period">Time Period</Label>
            <Select value={settings.period.type} onValueChange={handlePeriodChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="text-xs text-muted-foreground">Start Date</Label>
              <div className="font-medium">
                {settings.period.startDate.toLocaleDateString()}
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">End Date</Label>
              <div className="font-medium">
                {settings.period.endDate.toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 text-blue-800">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">
                {getPeriodDays()} days in this period
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Income Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="monthly-income">Monthly Income</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="monthly-income"
                type="number"
                placeholder="0.00"
                value={settings.totalIncome || ''}
                onChange={(e) => handleIncomeChange(e.target.value)}
                className="pl-7"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Monthly Income:</span>
              <span className="font-semibold">{formatCurrency(settings.totalIncome)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {settings.period.type.charAt(0).toUpperCase() + settings.period.type.slice(1)} Income:
              </span>
              <span className="font-semibold text-blue-600">
                {formatCurrency(getPerPeriodIncome())}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default BudgetPeriodSelector
