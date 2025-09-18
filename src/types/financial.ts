export interface FinancialSummary {
  totalBalance: number;
  monthlyExpenses: number;
  savings: number;
  lastUpdated?: Date;
}

export interface FinancialCard {
  id: string;
  title: string;
  value: number;
  icon: string;
  color: string;
  changePercentage?: number;
  changeDirection?: 'up' | 'down';
}

export interface FinancialContextType {
  financialData: FinancialSummary;
  updateFinancialData: (data: Partial<FinancialSummary>) => void;
  resetFinancialData: () => void;
  isLoading: boolean;
}
