"use client";
// pages/TransactionsPage.tsx
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload,
  TrendingUp,
  TrendingDown,
  Receipt,
  Calendar
} from 'lucide-react';
import TransactionsList from '@/components/transactions/TransactionsList';
import AddTransactionModal from '@/components/transactions/AddTransactionModal';
import TransactionStats from '@/components/transactions/TransactionStats';
import TransactionCharts from '@/components/transactions/TransactionCharts';
import BulkActions from '@/components/transactions/BulkActions';
import { Transaction, TransactionFilters as TFilters } from '@/types/transaction';

// Mock transaction data
const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'expense',
    amount: 85.50,
    description: 'Grocery shopping at Whole Foods',
    category: 'Food & Dining',
    categoryId: '1',
    date: '2025-01-20',
    account: 'Chase Checking',
    accountId: 'acc1',
    tags: ['groceries', 'food'],
    paymentMethod: 'credit_card',
    location: 'Whole Foods Market',
    receipt: null,
    recurring: false,
    status: 'completed'
  },
  {
    id: '2',
    type: 'income',
    amount: 3500.00,
    description: 'Monthly Salary',
    category: 'Salary',
    categoryId: '2',
    date: '2025-01-15',
    account: 'Chase Checking',
    accountId: 'acc1',
    tags: ['salary', 'work'],
    paymentMethod: 'direct_deposit',
    location: null,
    receipt: null,
    recurring: true,
    status: 'completed'
  },
  {
    id: '3',
    type: 'expense',
    amount: 12.99,
    description: 'Netflix subscription',
    category: 'Entertainment',
    categoryId: '3',
    date: '2025-01-18',
    account: 'Chase Checking',
    accountId: 'acc1',
    tags: ['subscription', 'streaming'],
    paymentMethod: 'credit_card',
    location: null,
    receipt: null,
    recurring: true,
    status: 'completed'
  },
  {
    id: '4',
    type: 'expense',
    amount: 45.20,
    description: 'Gas station fill-up',
    category: 'Transportation',
    categoryId: '4',
    date: '2025-01-17',
    account: 'Chase Checking',
    accountId: 'acc1',
    tags: ['gas', 'car'],
    paymentMethod: 'credit_card',
    location: 'Shell Gas Station',
    receipt: null,
    recurring: false,
    status: 'completed'
  },
  {
    id: '5',
    type: 'expense',
    amount: 125.00,
    description: 'Electric bill',
    category: 'Bills & Utilities',
    categoryId: '5',
    date: '2025-01-16',
    account: 'Chase Checking',
    accountId: 'acc1',
    tags: ['utilities', 'electric'],
    paymentMethod: 'auto_pay',
    location: null,
    receipt: null,
    recurring: true,
    status: 'completed'
  },
  {
    id: '6',
    type: 'transfer',
    amount: 500.00,
    description: 'Transfer to Savings',
    category: 'Transfer',
    categoryId: '6',
    date: '2025-01-15',
    account: 'Chase Checking',
    accountId: 'acc1',
    tags: ['savings', 'transfer'],
    paymentMethod: 'transfer',
    location: null,
    receipt: null,
    recurring: true,
    status: 'completed'
  },
  {
    id: '7',
    type: 'expense',
    amount: 89.99,
    description: 'Amazon purchase - Books',
    category: 'Shopping',
    categoryId: '7',
    date: '2025-01-14',
    account: 'Chase Credit Card',
    accountId: 'acc2',
    tags: ['amazon', 'books', 'education'],
    paymentMethod: 'credit_card',
    location: 'Amazon.com',
    receipt: null,
    recurring: false,
    status: 'pending'
  },
  {
    id: '8',
    type: 'income',
    amount: 250.00,
    description: 'Freelance project payment',
    category: 'Freelance',
    categoryId: '8',
    date: '2025-01-12',
    account: 'Chase Checking',
    accountId: 'acc1',
    tags: ['freelance', 'project'],
    paymentMethod: 'bank_transfer',
    location: null,
    receipt: null,
    recurring: false,
    status: 'completed'
  }
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<TFilters>({
    type: 'all',
    category: 'all',
    account: 'all',
    dateRange: 'all',
    status: 'all',
    amountRange: { min: null, max: null }
  });
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'description'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(transaction => {
        // Search filter
        if (searchQuery && !transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !transaction.category.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !transaction.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
          return false;
        }

        // Type filter
        if (filters.type !== 'all' && transaction.type !== filters.type) {
          return false;
        }

        // Category filter
        if (filters.category !== 'all' && transaction.category !== filters.category) {
          return false;
        }

        // Account filter
        if (filters.account !== 'all' && transaction.account !== filters.account) {
          return false;
        }

        // Status filter
        if (filters.status !== 'all' && transaction.status !== filters.status) {
          return false;
        }

        // Amount range filter
        if (filters.amountRange.min !== null && transaction.amount < filters.amountRange.min) {
          return false;
        }
        if (filters.amountRange.max !== null && transaction.amount > filters.amountRange.max) {
          return false;
        }

        // Date range filter
        if (filters.dateRange !== 'all') {
          const transactionDate = new Date(transaction.date);
          const now = new Date();
          
          switch (filters.dateRange) {
            case 'today':
              if (transactionDate.toDateString() !== now.toDateString()) return false;
              break;
            case 'week':
              const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              if (transactionDate < weekAgo) return false;
              break;
            case 'month':
              const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
              if (transactionDate < monthAgo) return false;
              break;
            case 'year':
              const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
              if (transactionDate < yearAgo) return false;
              break;
          }
        }

        return true;
      })
      .sort((a, b) => {
        let comparison = 0;
        
        switch (sortBy) {
          case 'date':
            comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
            break;
          case 'amount':
            comparison = a.amount - b.amount;
            break;
          case 'description':
            comparison = a.description.localeCompare(b.description);
            break;
        }
        
        return sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [transactions, searchQuery, filters, sortBy, sortOrder]);

  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString()
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const handleDeleteTransactions = (ids: string[]) => {
    setTransactions(prev => prev.filter(t => !ids.includes(t.id)));
    setSelectedTransactions([]);
  };

  const handleBulkEdit = (ids: string[], updates: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => 
      ids.includes(t.id) ? { ...t, ...updates } : t
    ));
    setSelectedTransactions([]);
  };

  const handleExportTransactions = () => {
    const csv = [
      ['Date', 'Type', 'Description', 'Category', 'Amount', 'Account', 'Status'],
      ...filteredTransactions.map(t => [
        t.date,
        t.type,
        t.description,
        t.category,
        t.amount.toString(),
        t.account,
        t.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Calculate statistics
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netAmount = totalIncome - totalExpenses;

  return (
    <div className="p-6 pt-16 md:pt-6 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
            <p className="text-gray-600 mt-1">Track and manage all your financial transactions</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleExportTransactions}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${totalIncome.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {filteredTransactions.filter(t => t.type === 'income').length} transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ${totalExpenses.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {filteredTransactions.filter(t => t.type === 'expense').length} transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Amount</CardTitle>
              <Receipt className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {netAmount >= 0 ? '+' : ''}${netAmount.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {filteredTransactions.length} total transactions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap gap-2">
                <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value as any }))}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.dateRange} onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value as any }))}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="amount">Amount</SelectItem>
                    <SelectItem value="description">Description</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </Button>
              </div>
            </div>

            {/* Applied Filters */}
            {(filters.type !== 'all' || filters.dateRange !== 'all' || searchQuery) && (
              <div className="flex flex-wrap gap-2 mt-4">
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    Search: {searchQuery}
                    <button onClick={() => setSearchQuery('')} className="ml-1 hover:bg-gray-300 rounded-full w-4 h-4 flex items-center justify-center text-xs">×</button>
                  </Badge>
                )}
                {filters.type !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    Type: {filters.type}
                    <button onClick={() => setFilters(prev => ({ ...prev, type: 'all' }))} className="ml-1 hover:bg-gray-300 rounded-full w-4 h-4 flex items-center justify-center text-xs">×</button>
                  </Badge>
                )}
                {filters.dateRange !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    Date: {filters.dateRange}
                    <button onClick={() => setFilters(prev => ({ ...prev, dateRange: 'all' }))} className="ml-1 hover:bg-gray-300 rounded-full w-4 h-4 flex items-center justify-center text-xs">×</button>
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedTransactions.length > 0 && (
          <BulkActions
            selectedCount={selectedTransactions.length}
            onDelete={() => handleDeleteTransactions(selectedTransactions)}
            onEdit={(updates) => handleBulkEdit(selectedTransactions, updates)}
            onClearSelection={() => setSelectedTransactions([])}
          />
        )}

        {/* Main Content */}
        <Tabs defaultValue="list" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 lg:w-fit">
            <TabsTrigger value="list">Transactions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <TransactionsList
              transactions={filteredTransactions}
              selectedTransactions={selectedTransactions}
              onSelectionChange={setSelectedTransactions}
              onEdit={(transaction) => {
                setTransactions(prev => prev.map(t => t.id === transaction.id ? transaction : t));
              }}
              onDelete={(id) => handleDeleteTransactions([id])}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <TransactionCharts transactions={filteredTransactions} />
          </TabsContent>

          <TabsContent value="statistics" className="space-y-4">
            <TransactionStats transactions={filteredTransactions} />
          </TabsContent>
        </Tabs>

        {/* Add Transaction Modal */}
        <AddTransactionModal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAddTransaction={handleAddTransaction}
        />
      </div>
    </div>
  );
}
