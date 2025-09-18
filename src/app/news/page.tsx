// app/news/page.tsx
'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCw, Loader2 } from 'lucide-react'
import NewsHeader from '../../components/news/NewsHeader'
import NewsGrid from '../../components/news/NewsGrid'
import NewsFilters from '../../components/news/NewsFilters'
import { NewsArticle, NewsFilters as NFilters } from '../../types/news'
import { useNews } from '../../hooks/useNews'

export default function NewsPage() {
  const [filters, setFilters] = useState<NFilters>({
    category: 'all',
    timeRange: 'all',
    sortBy: 'latest',
    searchTerm: ''
  })
  const [currentPage, setCurrentPage] = useState(1)

  const { articles, loading, error, pagination, refreshNews } = useNews(filters, currentPage)

  const handleArticleClick = (article: NewsArticle) => {
    // Navigate to article detail page
    window.open(`/news/${article.slug}`, '_blank')
    console.log('Opening article:', article.title)
  }

  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({ ...prev, category }))
    setCurrentPage(1)
  }

  const handleSearchChange = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, searchTerm }))
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <NewsHeader
        activeCategory={filters.category}
        onCategoryChange={handleCategoryChange}
        searchTerm={filters.searchTerm}
        onSearchChange={handleSearchChange}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Filters */}
          <NewsFilters
            filters={filters}
            onFiltersChange={setFilters}
            articleCount={articles.length}
          />

          {/* Refresh Button */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              {filters.category === 'all' ? 'All News' : 
               filters.category.charAt(0).toUpperCase() + filters.category.slice(1)}
            </h1>
            
            <Button
              variant="outline"
              size="sm"
              onClick={refreshNews}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-red-800">
                <strong>Error loading news:</strong> {error}
              </div>
              <p className="text-red-600 text-sm mt-1">
                Showing mock data for development. Check your API connection.
              </p>
            </div>
          )}

          {/* News Grid */}
          <NewsGrid
            articles={articles}
            onArticleClick={handleArticleClick}
            loading={loading}
          />

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-8">
              <Button
                variant="outline"
                disabled={!pagination.hasPrevious}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              >
                Previous
              </Button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={page === pagination.currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              
              <Button
                variant="outline"
                disabled={!pagination.hasNext}
                onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
