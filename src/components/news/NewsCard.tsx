// components/news/NewsCard.tsx
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Eye, User } from 'lucide-react'
import { NewsArticle } from '../../types/news'
import { formatDistanceToNow } from 'date-fns'

interface NewsCardProps {
  article: NewsArticle
  variant?: 'default' | 'compact' | 'horizontal'
  onClick: (article: NewsArticle) => void
}

const NewsCard: React.FC<NewsCardProps> = ({ 
  article, 
  variant = 'default',
  onClick 
}) => {
  const formatTimeAgo = (date: string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  }

  if (variant === 'horizontal') {
    return (
      <Card 
        className="group cursor-pointer hover:shadow-md transition-all duration-200"
        onClick={() => onClick(article)}
      >
        <CardContent className="p-4">
          <div className="flex space-x-4">
            {article.imageUrl && (
              <div className="relative w-24 h-24 flex-shrink-0">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover rounded-lg"
                />
                {article.isLive && (
                  <Badge className="absolute -top-2 -right-2 bg-red-600 text-white text-xs animate-pulse">
                    Live
                  </Badge>
                )}
              </div>
            )}
            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-2">
                <Badge 
                  variant="secondary" 
                  className="text-xs"
                  style={{ backgroundColor: `${article.category.color}20`, color: article.category.color }}
                >
                  {article.category.name}
                </Badge>
                {article.isBreaking && (
                  <Badge variant="destructive" className="text-xs">Breaking</Badge>
                )}
              </div>
              
              <h3 className="font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors">
                {article.title}
              </h3>
              
              <div className="flex items-center space-x-3 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatTimeAgo(article.publishedAt)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="h-3 w-3" />
                  <span>{article.views.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (variant === 'compact') {
    return (
      <Card 
        className="group cursor-pointer hover:shadow-md transition-all duration-200"
        onClick={() => onClick(article)}
      >
        <CardContent className="p-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge 
                variant="secondary" 
                className="text-xs"
                style={{ backgroundColor: `${article.category.color}20`, color: article.category.color }}
              >
                {article.category.name}
              </Badge>
              {(article.isLive || article.isBreaking) && (
                <div className="flex space-x-1">
                  {article.isLive && (
                    <Badge className="bg-red-600 text-white text-xs animate-pulse">Live</Badge>
                  )}
                  {article.isBreaking && (
                    <Badge variant="destructive" className="text-xs">Breaking</Badge>
                  )}
                </div>
              )}
            </div>
            
            <h3 className="font-medium line-clamp-3 text-sm group-hover:text-blue-600 transition-colors">
              {article.title}
            </h3>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{formatTimeAgo(article.publishedAt)}</span>
              <div className="flex items-center space-x-1">
                <Eye className="h-3 w-3" />
                <span>{article.views.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card 
      className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300"
      onClick={() => onClick(article)}
    >
      {article.imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3 flex space-x-2">
            {article.isLive && (
              <Badge className="bg-red-600 text-white animate-pulse flex items-center space-x-1">
                <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                <span>Live</span>
              </Badge>
            )}
            {article.isBreaking && (
              <Badge variant="destructive">Breaking</Badge>
            )}
          </div>
        </div>
      )}
      
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center space-x-2">
          <Badge 
            variant="secondary"
            style={{ backgroundColor: `${article.category.color}20`, color: article.category.color }}
          >
            {article.category.name}
          </Badge>
        </div>

        <h3 className="font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors">
          {article.title}
        </h3>

        <p className="text-gray-600 text-sm line-clamp-2">
          {article.summary}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{formatTimeAgo(article.publishedAt)}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <Eye className="h-3 w-3" />
            <span>{article.views.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default NewsCard
