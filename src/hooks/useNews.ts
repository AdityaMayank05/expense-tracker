// hooks/useNews.ts
import { useState, useEffect, useMemo } from 'react'
import { NewsArticle, NewsFilters, NewsPagination } from '../types/news'

interface UseNewsResult {
  articles: NewsArticle[]
  loading: boolean
  error: string | null
  pagination: NewsPagination
  refreshNews: () => void
}

export const useNews = (filters: NewsFilters, page: number = 1): UseNewsResult => {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<NewsPagination>({
    currentPage: 1,
    totalPages: 1,
    totalArticles: 0,
    hasNext: false,
    hasPrevious: false
  })

  const fetchNews = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        category: filters.category,
        timeRange: filters.timeRange,
        sortBy: filters.sortBy,
        search: filters.searchTerm,
      })

      // Replace with your actual API endpoint
      const response = await fetch(`/api/news?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch news')
      }

      const data = await response.json()
      
      setArticles(data.articles)
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching news:', err)
      
      // Mock data for development
      setArticles(mockNewsData)
      setPagination({
        currentPage: 1,
        totalPages: 3,
        totalArticles: mockNewsData.length,
        hasNext: true,
        hasPrevious: false
      })
    } finally {
      setLoading(false)
    }
  }

  const refreshNews = () => {
    fetchNews()
  }

  useEffect(() => {
    fetchNews()
  }, [filters, page])

  // Filter articles based on client-side filters (for mock data)
  const filteredArticles = useMemo(() => {
    if (error) {
      // Apply client-side filtering for mock data
      return articles.filter(article => {
        if (filters.category !== 'all' && article.category.slug !== filters.category) {
          return false
        }
        
        if (filters.searchTerm && !article.title.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
          return false
        }
        
        // Add more filtering logic as needed
        return true
      })
    }
    
    return articles
  }, [articles, filters, error])

  return {
    articles: filteredArticles,
    loading,
    error,
    pagination,
    refreshNews
  }
}

// Mock data for development
const mockNewsData: NewsArticle[] = [
  {
    id: '1',
    title: 'Why Has Australia Fallen Out of Love With Immigration?',
    summary: 'Australia faces growing concerns about immigration policies as public sentiment shifts dramatically in recent months.',
    content: 'Full article content here...',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop',
    author: 'Sarah Johnson',
    publishedAt: '2025-01-29T10:30:00Z',
    updatedAt: '2025-01-29T10:30:00Z',
    category: { id: 'world', name: 'World', slug: 'world', color: '#84CC16', icon: 'Globe' },
    tags: ['immigration', 'australia', 'politics'],
    isBreaking: true,
    isLive: false,
    readTime: 5,
    views: 12500,
    source: 'NewsHub',
    slug: 'australia-immigration-debate'
  },
  {
    id: '2',
    title: 'Five Countries Saving the Planet, According to Good Country Index',
    summary: 'Environmental leaders emerge as global rankings reveal which nations are making the biggest positive impact.',
    content: 'Full article content here...',
    imageUrl: 'https://images.unsplash.com/photo-1569163139394-de4e2ce0bb52?w=800&h=600&fit=crop',
    author: 'Michael Chen',
    publishedAt: '2025-01-29T08:15:00Z',
    updatedAt: '2025-01-29T08:15:00Z',
    category: { id: 'world', name: 'World', slug: 'world', color: '#84CC16', icon: 'Globe' },
    tags: ['environment', 'climate', 'sustainability'],
    isBreaking: false,
    isLive: false,
    readTime: 7,
    views: 8900,
    source: 'NewsHub',
    slug: 'countries-saving-planet'
  },
  {
    id: '3',
    title: 'Philippines Earthquake: Eight Deaths Reported on Luzon',
    summary: 'A powerful earthquake strikes the Philippines, causing casualties and widespread damage across Luzon island.',
    content: 'Full article content here...',
    imageUrl: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=600&fit=crop',
    author: 'Elena Rodriguez',
    publishedAt: '2025-01-29T06:45:00Z',
    updatedAt: '2025-01-29T09:20:00Z',
    category: { id: 'breaking', name: 'Breaking News', slug: 'breaking', color: '#EF4444', icon: 'Newspaper' },
    tags: ['earthquake', 'philippines', 'natural disaster'],
    isBreaking: true,
    isLive: true,
    readTime: 3,
    views: 25600,
    source: 'NewsHub',
    slug: 'philippines-earthquake-luzon'
  },
  {
    id: '4',
    title: 'French ex-PM Élisabeth Borne Found Not Guilty in Trial',
    summary: 'Former Prime Minister cleared of all charges in high-profile corruption case that captivated France.',
    content: 'Full article content here...',
    imageUrl: 'https://images.unsplash.com/photo-1541872705-1f73c6400ec9?w=800&h=600&fit=crop',
    author: 'Jean-Pierre Martin',
    publishedAt: '2025-01-29T05:30:00Z',
    updatedAt: '2025-01-29T05:30:00Z',
    category: { id: 'world', name: 'World', slug: 'world', color: '#84CC16', icon: 'Globe' },
    tags: ['france', 'politics', 'trial'],
    isBreaking: false,
    isLive: false,
    readTime: 4,
    views: 15200,
    source: 'NewsHub',
    slug: 'elisabeth-borne-trial-verdict'
  },
  {
    id: '5',
    title: 'Chelsea Move into Top Four After Crushing Brighton with Burgess',
    summary: 'Blues secure crucial victory with impressive performance, moving closer to Champions League qualification.',
    content: 'Full article content here...',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop',
    author: 'David Thompson',
    publishedAt: '2025-01-28T22:15:00Z',
    updatedAt: '2025-01-28T22:15:00Z',
    category: { id: 'sports', name: 'Sports', slug: 'sports', color: '#10B981', icon: 'Trophy' },
    tags: ['football', 'chelsea', 'premier league'],
    isBreaking: false,
    isLive: false,
    readTime: 6,
    views: 18700,
    source: 'NewsHub',
    slug: 'chelsea-brighton-premier-league'
  }
]
