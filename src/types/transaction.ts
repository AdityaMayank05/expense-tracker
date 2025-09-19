// types/transaction.ts
export interface Transaction {
    id: string;
    type: 'Income' | 'Expense' | 'Transfer';
    amount: number;
    description: string;
    category: string;
    categoryId?: string;
    date: string;
    account?: string;
    accountId?: string;
    tags: string[];
    paymentMethod: string;
    location?: string | null;
    receipt?: string | null;
    recurring: boolean;
    frequency?: 'Daily' | 'Weekly' | 'Monthly';
    status: 'Completed' | 'Pending' | 'Cancelled';
    notes?: string;
    subcategory?: string;
    merchantId?: string;
    referenceNumber?: string;
    receiptUrl?: string;
  }
  
  export interface TransactionFilters {
    type: 'all' | 'Income' | 'Expense' | 'Transfer';
    category: string;
    account: string;
    dateRange: 'all' | 'today' | 'week' | 'month' | 'year' | 'custom';
    status: 'all' | 'Completed' | 'Pending' | 'Cancelled';
    amountRange: {
      min: number | null;
      max: number | null;
    };
    customDateRange?: {
      start: string;
      end: string;
    };
  }
  
  export interface TransactionCategory {
    id: string;
    name: string;
    icon: string;
    color: string;
    type: 'Income' | 'Expense' | 'both';
    subcategories?: string[];
  }
  