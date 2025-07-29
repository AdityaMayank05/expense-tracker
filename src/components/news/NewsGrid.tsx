// components/news/NewsGrid.tsx
import React from 'react'
import { NewsArticle } from '../../types/news'
import NewsCard from './NewsCard'
import FeaturedNewsCard from './FeaturedNewsCard'

interface NewsGridProps {
  articles: NewsArticle[]
  onArticleClick: (article: NewsArticle) => void
  loading?: boolean
}

const NewsGrid: React.FC<NewsGridProps> = ({ articles, onArticleClick, loading }) => {
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Featured Article Skeleton */}
        <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />
        
        {/* Grid Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <div className="h-48 bg-gray-200 rounded-lg animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
        <p className="text-gray-600">Try adjusting your search or category filters.</p>
      </div>
    )
  }

  const [featuredArticle, ...otherArticles] = articles
  const recentArticles = otherArticles.slice(0, 6)
  const sidebarArticles = otherArticles.slice(6, 12)

  return (
    <div className="space-y-8">
      {/* Featured Article */}
      {featuredArticle && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Featured Story</h2>
          <FeaturedNewsCard 
            article={featuredArticle} 
            onClick={onArticleClick}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <h2 className="text-2xl font-bold">Latest News</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentArticles.map((article) => (
              <NewsCard
                key={article.id}
                article={article}
                onClick={onArticleClick}
              />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <h3 className="text-lg font-semibold">Trending</h3>
          <div className="space-y-4">
            {sidebarArticles.map((article) => (
              <NewsCard
                key={article.id}
                article={article}
                variant="compact"
                onClick={onArticleClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewsGrid
