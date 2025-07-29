// types/news.ts
export interface NewsArticle {
    id: string
    title: string
    summary: string
    content: string
    imageUrl?: string
    author: string
    publishedAt: string
    updatedAt: string
    category: NewsCategory
    tags: string[]
    isBreaking: boolean
    isLive: boolean
    readTime: number
    views: number
    source: string
    slug: string
  }
  
  export interface NewsCategory {
    id: string
    name: string
    slug: string
    color: string
    icon: string
  }
  
  export interface NewsPagination {
    currentPage: number
    totalPages: number
    totalArticles: number
    hasNext: boolean
    hasPrevious: boolean
  }
  
  export interface NewsFilters {
    category: string
    timeRange: 'today' | 'week' | 'month' | 'all'
    sortBy: 'latest' | 'popular' | 'trending'
    searchTerm: string
  }
  