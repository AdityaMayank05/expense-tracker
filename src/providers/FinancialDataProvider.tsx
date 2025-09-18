'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FinancialSummary, FinancialContextType } from '@/types/financial';
import { saveFinancialData, loadFinancialData, defaultFinancialData } from '@/lib/financialStorage';

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

interface FinancialDataProviderProps {
  children: ReactNode;
}

export const FinancialDataProvider: React.FC<FinancialDataProviderProps> = ({ children }) => {
  const [financialData, setFinancialData] = useState<FinancialSummary>(defaultFinancialData);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const savedData = loadFinancialData();
        setFinancialData(savedData);
      } catch (error) {
        console.error('Error loading financial data:', error);
        setFinancialData(defaultFinancialData);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Update financial data and save to localStorage
  const updateFinancialData = (updatedData: Partial<FinancialSummary>) => {
    const newData = {
      ...financialData,
      ...updatedData,
      lastUpdated: new Date(),
    };
    
    setFinancialData(newData);
    saveFinancialData(newData);
  };

  // Reset financial data to defaults
  const resetFinancialData = () => {
    setFinancialData(defaultFinancialData);
    saveFinancialData(defaultFinancialData);
  };

  const contextValue: FinancialContextType = {
    financialData,
    updateFinancialData,
    resetFinancialData,
    isLoading,
  };

  return (
    <FinancialContext.Provider value={contextValue}>
      {children}
    </FinancialContext.Provider>
  );
};

// Hook to use the financial context
export const useFinancialData = (): FinancialContextType => {
  const context = useContext(FinancialContext);
  if (context === undefined) {
    throw new Error('useFinancialData must be used within a FinancialDataProvider');
  }
  return context;
};
