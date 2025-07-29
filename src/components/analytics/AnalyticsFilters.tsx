// components/analytics/AnalyticsFilters.tsx
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Filter, 
  X, 
  Calendar as CalendarIcon, 
  DollarSign,
  Building2,
  Tag,
  RefreshCw
} from 'lucide-react'
import { AnalyticsFilters as AFilters } from '../../types/analytics'
import { format } from 'date-fns'

interface AnalyticsFiltersProps {
  filters: AFilters
  onFiltersChange: (filters: AFilters) => void
  availableCategories: Array<{ id: string; name: string; color: string }>
  availableMerchants: string[]
  onReset: () => void
}

const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({
  filters,
  onFiltersChange,
  availableCategories,
  availableMerchants,
  onReset
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const updateFilter = (key: keyof AFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const updateDateRange = (field: 'start' | 'end', date: Date) => {
    updateFilter('dateRange', {
      ...filters.dateRange,
      [field]: format(date, 'yyyy-MM-dd'),
      preset: 'custom'
    })
  }

  const setDatePreset = (preset: 'week' | 'month' | 'quarter' | 'year') => {
    const now = new Date()
    let start = new Date()
    
    switch (preset) {
      case 'week':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        start = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        break
      case 'quarter':
        start = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
        break
      case 'year':
        start = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
        break
    }

    updateFilter('dateRange', {
      start: format(start, 'yyyy-MM-dd'),
      end: format(now, 'yyyy-MM-dd'),
      preset
    })
  }

  const toggleCategory = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter(id => id !== categoryId)
      : [...filters.categories, categoryId]
    updateFilter('categories', newCategories)
  }

  const toggleMerchant = (merchant: string) => {
    const newMerchants = filters.merchants.includes(merchant)
      ? filters.merchants.filter(m => m !== merchant)
      : [...filters.merchants, merchant]
    updateFilter('merchants', newMerchants)
  }

  const toggleTransactionType = (type: 'income' | 'expense' | 'transfer') => {
    const newTypes = filters.transactionTypes.includes(type)
      ? filters.transactionTypes.filter(t => t !== type)
      : [...filters.transactionTypes, type]
    updateFilter('transactionTypes', newTypes)
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.categories.length > 0) count++
    if (filters.merchants.length > 0) count++
    if (filters.amountRange.min !== null || filters.amountRange.max !== null) count++
    if (filters.transactionTypes.length < 3) count++
    if (filters.dateRange.preset !== 'month') count++
    return count
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <CardTitle className="text-lg">Filters</CardTitle>
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary">{getActiveFiltersCount()} active</Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              disabled={getActiveFiltersCount() === 0}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Reset
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Less' : 'More'} Filters
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Date Range */}
        <div className="space-y-3">
          <Label className="flex items-center space-x-2">
            <CalendarIcon className="h-4 w-4" />
            <span>Date Range</span>
          </Label>
          
          <div className="flex flex-wrap gap-2">
            {(['week', 'month', 'quarter', 'year'] as const).map((preset) => (
              <Button
                key={preset}
                variant={filters.dateRange.preset === preset ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDatePreset(preset)}
              >
                {preset.charAt(0).toUpperCase() + preset.slice(1)}
              </Button>
            ))}
          </div>

          {/* Custom Date Range */}
          <div className="grid grid-cols-2 gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {format(new Date(filters.dateRange.start), 'MMM dd, yyyy')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={new Date(filters.dateRange.start)}
                  onSelect={(date) => date && updateDateRange('start', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {format(new Date(filters.dateRange.end), 'MMM dd, yyyy')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={new Date(filters.dateRange.end)}
                  onSelect={(date) => date && updateDateRange('end', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Transaction Types */}
        <div className="space-y-3">
          <Label>Transaction Types</Label>
          <div className="flex flex-wrap gap-2">
            {(['income', 'expense', 'transfer'] as const).map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={type}
                  checked={filters.transactionTypes.includes(type)}
                  onCheckedChange={() => toggleTransactionType(type)}
                />
                <Label htmlFor={type} className="text-sm capitalize">
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {isExpanded && (
          <>
            {/* Categories */}
            <div className="space-y-3">
              <Label className="flex items-center space-x-2">
                <Tag className="h-4 w-4" />
                <span>Categories</span>
                {filters.categories.length > 0 && (
                  <Badge variant="secondary">{filters.categories.length}</Badge>
                )}
              </Label>
              
              <div className="max-h-40 overflow-y-auto space-y-2">
                {availableCategories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={category.id}
                      checked={filters.categories.includes(category.id)}
                      onCheckedChange={() => toggleCategory(category.id)}
                    />
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <Label htmlFor={category.id} className="text-sm">
                        {category.name}
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Amount Range */}
            <div className="space-y-3">
              <Label className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span>Amount Range</span>
              </Label>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="min-amount" className="text-xs">Min Amount</Label>
                  <Input
                    id="min-amount"
                    type="number"
                    placeholder="0.00"
                    value={filters.amountRange.min || ''}
                    onChange={(e) => updateFilter('amountRange', {
                      ...filters.amountRange,
                      min: e.target.value ? parseFloat(e.target.value) : null
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="max-amount" className="text-xs">Max Amount</Label>
                  <Input
                    id="max-amount"
                    type="number"
                    placeholder="No limit"
                    value={filters.amountRange.max || ''}
                    onChange={(e) => updateFilter('amountRange', {
                      ...filters.amountRange,
                      max: e.target.value ? parseFloat(e.target.value) : null
                    })}
                  />
                </div>
              </div>
            </div>

            {/* Top Merchants */}
            <div className="space-y-3">
              <Label className="flex items-center space-x-2">
                <Building2 className="h-4 w-4" />
                <span>Merchants</span>
                {filters.merchants.length > 0 && (
                  <Badge variant="secondary">{filters.merchants.length}</Badge>
                )}
              </Label>
              
              <div className="max-h-40 overflow-y-auto space-y-2">
                {availableMerchants.slice(0, 10).map((merchant) => (
                  <div key={merchant} className="flex items-center space-x-2">
                    <Checkbox
                      id={merchant}
                      checked={filters.merchants.includes(merchant)}
                      onCheckedChange={() => toggleMerchant(merchant)}
                    />
                    <Label htmlFor={merchant} className="text-sm">
                      {merchant}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Active Filters Display */}
        {getActiveFiltersCount() > 0 && (
          <div className="space-y-2">
            <Label className="text-xs font-medium">Active Filters</Label>
            <div className="flex flex-wrap gap-1">
              {filters.categories.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {filters.categories.length} categories
                  <button 
                    onClick={() => updateFilter('categories', [])}
                    className="ml-1 hover:bg-gray-300 rounded-full w-3 h-3 flex items-center justify-center"
                  >
                    <X className="h-2 w-2" />
                  </button>
                </Badge>
              )}
              
              {filters.merchants.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {filters.merchants.length} merchants
                  <button 
                    onClick={() => updateFilter('merchants', [])}
                    className="ml-1 hover:bg-gray-300 rounded-full w-3 h-3 flex items-center justify-center"
                  >
                    <X className="h-2 w-2" />
                  </button>
                </Badge>
              )}
              
              {(filters.amountRange.min !== null || filters.amountRange.max !== null) && (
                <Badge variant="secondary" className="text-xs">
                  Amount range
                  <button 
                    onClick={() => updateFilter('amountRange', { min: null, max: null })}
                    className="ml-1 hover:bg-gray-300 rounded-full w-3 h-3 flex items-center justify-center"
                  >
                    <X className="h-2 w-2" />
                  </button>
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default AnalyticsFilters
