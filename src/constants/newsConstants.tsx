// constants/newsConstants.tsx
import React from 'react'
import { 
  Newspaper, 
  Trophy, 
  Plane, 
  Briefcase, 
  Heart, 
  Cpu, 
  Globe,
  TrendingUp 
} from 'lucide-react'

export const newsCategories = [
  { id: 'breaking', name: 'Breaking News', slug: 'breaking', color: '#EF4444', icon: 'Newspaper' },
  { id: 'sports', name: 'Sports', slug: 'sports', color: '#10B981', icon: 'Trophy' },
  { id: 'travel', name: 'Travel', slug: 'travel', color: '#3B82F6', icon: 'Plane' },
  { id: 'business', name: 'Business', slug: 'business', color: '#8B5CF6', icon: 'Briefcase' },
  { id: 'health', name: 'Health', slug: 'health', color: '#F59E0B', icon: 'Heart' },
  { id: 'technology', name: 'Technology', slug: 'technology', color: '#06B6D4', icon: 'Cpu' },
  { id: 'world', name: 'World', slug: 'world', color: '#84CC16', icon: 'Globe' },
  { id: 'trending', name: 'Trending', slug: 'trending', color: '#F97316', icon: 'TrendingUp' },
]

export const categoryIcons: Record<string, React.ReactNode> = {
  'Newspaper': <Newspaper className="h-4 w-4" />,
  'Trophy': <Trophy className="h-4 w-4" />,
  'Plane': <Plane className="h-4 w-4" />,
  'Briefcase': <Briefcase className="h-4 w-4" />,
  'Heart': <Heart className="h-4 w-4" />,
  'Cpu': <Cpu className="h-4 w-4" />,
  'Globe': <Globe className="h-4 w-4" />,
  'TrendingUp': <TrendingUp className="h-4 w-4" />,
}
