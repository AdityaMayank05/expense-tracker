// components/news/NewsFilters.tsx
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Filter, X, TrendingUp, Clock, Eye } from 'lucide-react'
import { NewsFilters as NFilters } from '../../types/news'

interface NewsFiltersProps {
  filters: NFilters
  onFiltersChange: (filters: NFilters) => void
  articleCount: number
}

const NewsFilters: React.FC<NewsFiltersProps> = ({
  filters,
  onFiltersChange,
  articleCount
}) => {
  const updateFilter = (key: keyof NFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onFiltersChange({
      category: 'all',
      timeRange: 'all',
      sortBy: 'latest',
      searchTerm: ''
    })
  }

  const hasActiveFilters = filters.category !== 'all' || 
                          filters.timeRange !== 'all' || 
                          filters.sortBy !== 'latest' ||
                          filters.searchTerm !== ''

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span className="font-medium">Filters</span>
            <Badge variant="secondary">{articleCount} articles</Badge>
          </div>
          
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Time Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Time Range</label>
            <Select value={filters.timeRange} onValueChange={(value) => updateFilter('timeRange', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort By */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Sort By</label>
            <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Latest</span>
                  </div>
                </SelectItem>
                <SelectItem value="popular">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <span>Most Popular</span>
                  </div>
                </SelectItem>
                <SelectItem value="trending">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>Trending</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters Display */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Active Filters</label>
            <div className="flex flex-wrap gap-1">
              {filters.category !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  Category: {filters.category}
                  <button 
                    onClick={() => updateFilter('category', 'all')}
                    className="ml-1 hover:bg-gray-300 rounded-full w-3 h-3 flex items-center justify-center"
                  >
                    <X className="h-2 w-2" />
                  </button>
                </Badge>
              )}
              {filters.searchTerm && (
                <Badge variant="secondary" className="text-xs">
                  Search: {filters.searchTerm}
                  <button 
                    onClick={() => updateFilter('searchTerm', '')}
                    className="ml-1 hover:bg-gray-300 rounded-full w-3 h-3 flex items-center justify-center"
                  >
                    <X className="h-2 w-2" />
                  </button>
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default NewsFilters
