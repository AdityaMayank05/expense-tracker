// constants/budgetConstants.tsx
import React from 'react'
import { 
  Utensils, Car, Home, Zap, ShoppingBag, Heart, 
  GraduationCap, Gamepad2, PiggyBank, CreditCard,
  Gift, Plane, Wrench, Phone
} from 'lucide-react'

export const categoryIcons: Record<string, React.ReactNode> = {
  'Food & Dining': <Utensils className="h-5 w-5" />,
  'Transportation': <Car className="h-5 w-5" />,
  'Housing': <Home className="h-5 w-5" />,
  'Utilities': <Zap className="h-5 w-5" />,
  'Shopping': <ShoppingBag className="h-5 w-5" />,
  'Healthcare': <Heart className="h-5 w-5" />,
  'Education': <GraduationCap className="h-5 w-5" />,
  'Entertainment': <Gamepad2 className="h-5 w-5" />,
  'Savings': <PiggyBank className="h-5 w-5" />,
  'Debt Payment': <CreditCard className="h-5 w-5" />,
  'Gifts': <Gift className="h-5 w-5" />,
  'Travel': <Plane className="h-5 w-5" />,
  'Maintenance': <Wrench className="h-5 w-5" />,
  'Phone & Internet': <Phone className="h-5 w-5" />,
}

export const budgetTemplates = [
  {
    id: '50-30-20',
    name: '50/30/20 Rule',
    description: 'Allocate 50% to needs, 30% to wants, and 20% to savings',
    categories: { needs: 50, wants: 30, savings: 20 }
  },
  {
    id: 'zero-based',
    name: 'Zero-Based Budgeting',
    description: 'Assign every dollar a purpose, leaving zero unallocated',
    categories: { needs: 60, wants: 25, savings: 15 }
  },
  {
    id: 'envelope',
    name: 'Envelope Method',
    description: 'Divide income into specific category envelopes',
    categories: { needs: 55, wants: 20, savings: 25 }
  },
  {
    id: 'aggressive-savings',
    name: 'Aggressive Savings',
    description: 'Maximize savings with minimal discretionary spending',
    categories: { needs: 50, wants: 15, savings: 35 }
  },
  {
    id: 'debt-focused',
    name: 'Debt Payoff',
    description: 'Prioritize debt reduction while maintaining essentials',
    categories: { needs: 50, wants: 15, savings: 10, debt: 25 }
  }
]

export const defaultCategories = [
  { name: 'Food & Dining', type: 'needs', color: '#10B981' },
  { name: 'Housing', type: 'needs', color: '#3B82F6' },
  { name: 'Transportation', type: 'needs', color: '#8B5CF6' },
  { name: 'Utilities', type: 'needs', color: '#F59E0B' },
  { name: 'Healthcare', type: 'needs', color: '#EF4444' },
  { name: 'Phone & Internet', type: 'needs', color: '#06B6D4' },
  { name: 'Entertainment', type: 'wants', color: '#F97316' },
  { name: 'Shopping', type: 'wants', color: '#EC4899' },
  { name: 'Travel', type: 'wants', color: '#84CC16' },
  { name: 'Gifts', type: 'wants', color: '#A855F7' },
  { name: 'Savings', type: 'savings', color: '#059669' },
  { name: 'Emergency Fund', type: 'savings', color: '#0891B2' },
  { name: 'Debt Payment', type: 'debt', color: '#DC2626' },
] as const
