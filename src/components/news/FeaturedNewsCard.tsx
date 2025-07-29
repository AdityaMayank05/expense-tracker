// components/news/FeaturedNewsCard.tsx
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Eye, User, Play } from 'lucide-react'
import { NewsArticle } from '../../types/news'
import { formatDistanceToNow } from 'date-fns'

interface FeaturedNewsCardProps {
  article: NewsArticle
  onClick: (article: NewsArticle) => void
}

const FeaturedNewsCard: React.FC<FeaturedNewsCardProps> = ({ article, onClick }) => {
  const formatTimeAgo = (date: string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  }

  return (
    <Card 
      className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300"
      onClick={() => onClick(article)}
    >
      <div className="relative">
        {article.imageUrl && (
          <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Live Badge */}
            {article.isLive && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-red-600 text-white animate-pulse flex items-center space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                  <span>Live</span>
                </Badge>
              </div>
            )}

            {/* Breaking Badge */}
            {article.isBreaking && (
              <div className="absolute top-4 right-4">
                <Badge variant="destructive">Breaking</Badge>
              </div>
            )}

            {/* Play Button for Video Content */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="lg" className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30">
                <Play className="h-6 w-6 text-white" />
              </Button>
            </div>
          </div>
        )}

        <CardContent className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Badge 
                className="text-xs"
                style={{ backgroundColor: article.category.color }}
              >
                {article.category.name}
              </Badge>
              <div className="flex items-center space-x-4 text-sm text-white/80">
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

            <h2 className="text-2xl font-bold leading-tight group-hover:text-blue-200 transition-colors">
              {article.title}
            </h2>

            <p className="text-white/90 line-clamp-2">
              {article.summary}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-white/80">
                <User className="h-3 w-3" />
                <span>{article.author}</span>
                <span>•</span>
                <span>{article.readTime} min read</span>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

export default FeaturedNewsCard
