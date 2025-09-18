import { FinancialSummary } from '@/types/financial';

const STORAGE_KEY = 'expense-tracker-financial-data';

// Default financial data
export const defaultFinancialData: FinancialSummary = {
  totalBalance: 12847,
  monthlyExpenses: 2347,
  savings: 3842,
  lastUpdated: new Date(),
};

// Save financial data to localStorage
export const saveFinancialData = (data: FinancialSummary): void => {
  try {
    const dataWithTimestamp = {
      ...data,
      lastUpdated: new Date(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataWithTimestamp));
  } catch (error) {
    console.error('Failed to save financial data:', error);
  }
};

// Load financial data from localStorage
export const loadFinancialData = (): FinancialSummary => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      return {
        ...parsed,
        lastUpdated: parsed.lastUpdated ? new Date(parsed.lastUpdated) : new Date(),
      };
    }
  } catch (error) {
    console.error('Failed to load financial data:', error);
  }
  return defaultFinancialData;
};

// Clear financial data from localStorage
export const clearFinancialData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear financial data:', error);
  }
};

// Format currency for display
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Validate financial input
export const validateFinancialInput = (value: string): { isValid: boolean; numericValue: number } => {
  // Remove currency symbols and commas
  const cleanedValue = value.replace(/[$,]/g, '').trim();
  
  // Check if it's a valid number
  const numericValue = parseFloat(cleanedValue);
  const isValid = !isNaN(numericValue) && isFinite(numericValue) && numericValue >= 0;
  
  return {
    isValid,
    numericValue: isValid ? numericValue : 0,
  };
};
