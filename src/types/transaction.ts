// types/transaction.ts
export interface Transaction {
    id: string;
    type: 'income' | 'expense' | 'transfer';
    amount: number;
    description: string;
    category: string;
    categoryId: string;
    date: string;
    account: string;
    accountId: string;
    tags: string[];
    paymentMethod: 'cash' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'check' | 'digital_wallet' | 'direct_deposit' | 'auto_pay' | 'transfer';
    location?: string | null;
    receipt?: string | null;
    recurring: boolean;
    status: 'completed' | 'pending' | 'cancelled';
    notes?: string;
    subcategory?: string;
    merchantId?: string;
    referenceNumber?: string;
  }
  
  export interface TransactionFilters {
    type: 'all' | 'income' | 'expense' | 'transfer';
    category: string;
    account: string;
    dateRange: 'all' | 'today' | 'week' | 'month' | 'year' | 'custom';
    status: 'all' | 'completed' | 'pending' | 'cancelled';
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
    type: 'income' | 'expense' | 'both';
    subcategories?: string[];
  }
  