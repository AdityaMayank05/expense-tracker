// components/news/NewsHeader.tsx
import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Bell, Menu } from 'lucide-react'
import { newsCategories, categoryIcons } from '../../constants/newsConstants'

interface NewsHeaderProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
  searchTerm: string
  onSearchChange: (term: string) => void
}

const NewsHeader: React.FC<NewsHeaderProps> = ({
  activeCategory,
  onCategoryChange,
  searchTerm,
  onSearchChange
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Top Stories</h1>
                <div className="flex items-center space-x-2">
                  <Badge variant="destructive" className="text-xs text-black animate-pulse">
                    Breaking News
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search news..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="flex items-center space-x-1 py-2 overflow-x-auto scrollbar-hide">
          <Button
            variant={activeCategory === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onCategoryChange('all')}
            className="whitespace-nowrap"
          >
            All News
          </Button>
          {newsCategories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.slug ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onCategoryChange(category.slug)}
              className="whitespace-nowrap flex items-center space-x-1"
            >
              {categoryIcons[category.icon]}
              <span>{category.name}</span>
            </Button>
          ))}
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>
    </header>
  )
}

export default NewsHeader
