// types/budget.ts
export interface BudgetCategory {
    id: string
    name: string
    icon: string
    amount: number
    allocated: number
    spent: number
    color: string
    type: 'needs' | 'wants' | 'savings' | 'debt'
    rolloverEnabled: boolean
    rolloverAmount?: number
  }
  
  export interface BudgetTemplate {
    id: string
    name: string
    description: string
    categories: {
      needs: number
      wants: number
      savings: number
      debt?: number
    }
  }
  
  export interface BudgetPeriod {
    type: 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'yearly'
    startDate: Date
    endDate: Date
  }
  
  export interface BudgetSettings {
    totalIncome: number
    period: BudgetPeriod
    rolloverPolicy: 'carry-over' | 'reset' | 'percentage'
    rolloverPercentage?: number
    autoAdjust: boolean
  }
  
  export interface Budget {
    id: string
    name: string
    settings: BudgetSettings
    categories: BudgetCategory[]
    createdAt: Date
    updatedAt: Date
    isActive: boolean
  }
  