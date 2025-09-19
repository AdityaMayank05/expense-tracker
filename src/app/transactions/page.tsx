"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Dialog, Transition } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  // Navigation and UI
  ChevronRight,
  ChevronLeft,
  Sun,
  Moon,
  ArrowRight,
  X,
  Check,
  Info,
  Download,
  Upload,
  Trash2,
  Edit3,
  Filter,
  List,
  ArrowUpDown,
  Search,
  // Status and types
  TrendingUp,
  TrendingDown,
  ArrowLeftRight,
  CheckCircle,
  Clock,
  XCircle,
  // Finance and fields
  DollarSign,
  CreditCard,
  Banknote,
  CalendarDays,
  Building,
  MapPin,
  Tag,
  Receipt,
  Camera,
  FileText,
} from 'lucide-react';

// ====== Types ======
type TxType = 'Income' | 'Expense' | 'Transfer';
type TxStatus = 'Completed' | 'Pending' | 'Cancelled';
type TxFrequency = 'Daily' | 'Weekly' | 'Monthly' | undefined;

interface Transaction {
  id: string;
  type: TxType;
  amount: number;
  description: string;
  category: string;
  date: string; // ISO (yyyy-mm-dd)
  account: string;
  paymentMethod: string;
  status: TxStatus;
  location?: string;
  tags: string[];
  recurring?: boolean;
  frequency?: TxFrequency;
  receiptUrl?: string;
  referenceNumber?: string;
}

type DateRangePreset = 'all' | 'today' | 'week' | 'month' | 'custom';

interface TransactionFilters {
  type: TxType | 'all';
  category: string | 'all';
  account: string | 'all';
  status: TxStatus | 'all';
  dateRange: DateRangePreset;
  customDateRange: { start: string; end: string };
  amountRange: { min: number | null; max: number | null };
}

// ====== Constants (colors aligned with dashboard theme palette) ======
// Light: blue-600, emerald-500, red-500, amber-500
// Dark: slate surfaces, same accents with slight tone adjustments via Tailwind
const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Entertainment',
  'Bills & Utilities',
  'Shopping',
  'Healthcare',
  'Education',
  'Salary',
  'Freelance',
  'Investments',
  'Insurance',
  'Health & Fitness',
  'Rewards',
];

const ACCOUNTS = [
  'Chase Checking',
  'Chase Credit Card',
  'Savings Account',
  'Investment Account',
];

const PAYMENT_METHODS = ['Credit Card', 'Debit Card', 'Cash', 'Bank Transfer'];

// ====== Mock Data ======
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn_1001',
    type: 'Income',
    amount: 3200,
    description: 'Monthly Salary',
    category: 'Salary',
    date: '2025-09-05',
    account: 'Chase Checking',
    paymentMethod: 'Bank Transfer',
    status: 'Completed',
    tags: ['Payroll'],
    referenceNumber: 'PAY-0925-01',
  },
  {
    id: 'txn_1002',
    type: 'Expense',
    amount: 72.5,
    description: 'Groceries at Whole Foods',
    category: 'Food & Dining',
    date: '2025-09-12',
    account: 'Chase Credit Card',
    paymentMethod: 'Credit Card',
    status: 'Completed',
    location: 'Austin, TX',
    tags: ['Groceries', 'Family'],
    receiptUrl: 'https://example.com/receipt_1002.pdf',
  },
  {
    id: 'txn_1003',
    type: 'Expense',
    amount: 18.99,
    description: 'Netflix Subscription',
    category: 'Entertainment',
    date: '2025-09-01',
    account: 'Chase Credit Card',
    paymentMethod: 'Credit Card',
    status: 'Completed',
    recurring: true,
    frequency: 'Monthly',
    tags: ['Streaming'],
  },
  {
    id: 'txn_1004',
    type: 'Expense',
    amount: 56.2,
    description: 'Gas - Shell',
    category: 'Transportation',
    date: '2025-09-13',
    account: 'Chase Credit Card',
    paymentMethod: 'Credit Card',
    status: 'Completed',
    location: 'Round Rock, TX',
    tags: ['Car', 'Fuel'],
  },
  {
    id: 'txn_1005',
    type: 'Expense',
    amount: 129.5,
    description: 'Electricity Bill',
    category: 'Bills & Utilities',
    date: '2025-09-03',
    account: 'Chase Checking',
    paymentMethod: 'Bank Transfer',
    status: 'Completed',
    tags: ['Home'],
  },
  {
    id: 'txn_1006',
    type: 'Income',
    amount: 650,
    description: 'Freelance UI Work',
    category: 'Freelance',
    date: '2025-08-28',
    account: 'Chase Checking',
    paymentMethod: 'Bank Transfer',
    status: 'Completed',
    tags: ['Side Hustle'],
  },
  {
    id: 'txn_1007',
    type: 'Transfer',
    amount: 500,
    description: 'Move to Savings',
    category: 'Investments',
    date: '2025-09-10',
    account: 'Savings Account',
    paymentMethod: 'Bank Transfer',
    status: 'Completed',
    tags: ['Savings'],
  },
  {
    id: 'txn_1008',
    type: 'Expense',
    amount: 42.3,
    description: 'Gym Membership',
    category: 'Health & Fitness',
    date: '2025-09-02',
    account: 'Chase Credit Card',
    paymentMethod: 'Credit Card',
    status: 'Completed',
    recurring: true,
    frequency: 'Monthly',
    tags: ['Fitness'],
  },
  {
    id: 'txn_1009',
    type: 'Expense',
    amount: 14.75,
    description: 'Coffee - Starbucks',
    category: 'Food & Dining',
    date: '2025-09-11',
    account: 'Chase Credit Card',
    paymentMethod: 'Credit Card',
    status: 'Completed',
    tags: ['Coffee'],
  },
  {
    id: 'txn_1010',
    type: 'Expense',
    amount: 220.0,
    description: 'Car Insurance',
    category: 'Insurance',
    date: '2025-08-20',
    account: 'Chase Checking',
    paymentMethod: 'Bank Transfer',
    status: 'Completed',
    tags: ['Car'],
  },
  {
    id: 'txn_1011',
    type: 'Expense',
    amount: 85.0,
    description: 'Textbooks',
    category: 'Education',
    date: '2025-09-07',
    account: 'Chase Credit Card',
    paymentMethod: 'Credit Card',
    status: 'Pending',
    tags: ['College'],
  },
  {
    id: 'txn_1012',
    type: 'Income',
    amount: 120,
    description: 'Cashback Rewards',
    category: 'Rewards',
    date: '2025-08-31',
    account: 'Chase Credit Card',
    paymentMethod: 'Credit Card',
    status: 'Completed',
    tags: ['Rewards'],
  },
];

// ====== Helpers ======
const classNames = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

const formatCurrency = (amount: number) =>
  amount.toLocaleString(undefined, { style: 'currency', currency: 'USD' });

const getTypeColor = (type: TxType) =>
  type === 'Income'
    ? 'text-emerald-600 dark:text-emerald-400'
    : type === 'Expense'
    ? 'text-red-600 dark:text-red-400'
    : 'text-blue-600 dark:text-blue-400';

const getStatusChip = (status: TxStatus) => {
  switch (status) {
    case 'Completed':
      return { className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300', icon: CheckCircle };
    case 'Pending':
      return { className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300', icon: Clock };
    default:
      return { className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', icon: XCircle };
  }
};

const getTransactionIcon = (type: TxType) => {
  if (type === 'Income') return <TrendingUp className="h-5 w-5 text-emerald-500" />;
  if (type === 'Expense') return <TrendingDown className="h-5 w-5 text-red-500" />;
  return <ArrowLeftRight className="h-5 w-5 text-blue-500" />;
};

const getPaymentIcon = (method: string) => {
  switch (method) {
    case 'Credit Card':
    case 'Debit Card':
      return <CreditCard className="h-4 w-4" />;
    case 'Cash':
      return <Banknote className="h-4 w-4" />;
    default:
      return <ArrowLeftRight className="h-4 w-4" />;
  }
};

// ====== Skeletons ======
function CardSkeleton() {
  return (
    <div className="p-4 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 animate-pulse">
      <div className="h-4 w-24 bg-gray-200 dark:bg-slate-700 rounded mb-2" />
      <div className="h-6 w-32 bg-gray-200 dark:bg-slate-700 rounded" />
    </div>
  );
}

function RowSkeleton() {
  return (
    <div className="p-4 border-b border-gray-100 dark:border-slate-700 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-slate-700" />
          <div>
            <div className="h-4 w-48 bg-gray-200 dark:bg-slate-700 rounded mb-2" />
            <div className="h-3 w-28 bg-gray-200 dark:bg-slate-700 rounded" />
          </div>
        </div>
        <div className="h-4 w-20 bg-gray-200 dark:bg-slate-700 rounded" />
      </div>
    </div>
  );
}

// ====== Component ======
export default function TransactionsPage() {
  // Dark mode
  const [isDark, setIsDark] = useState(false);

  // Data
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // UI
  const [searchQuery, setSearchQuery] = useState('');
  const [showStats, setShowStats] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Filters
  const [filters, setFilters] = useState<TransactionFilters>({
    type: 'all',
    category: 'all',
    account: 'all',
    status: 'all',
    dateRange: 'all',
    customDateRange: { start: '', end: '' },
    amountRange: { min: null, max: null },
  });

  // Sorting and selection
  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState({
    type: 'Expense' as TxType,
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    account: '',
    paymentMethod: 'Credit Card',
    location: '',
    tags: [] as string[],
    recurring: false,
    frequency: '' as '' | Exclude<TxFrequency, undefined>,
    status: 'Completed' as TxStatus,
    receiptUrl: '',
    referenceNumber: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Effects
  useEffect(() => {
    // Dark theme init
    const stored = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    const prefersDark =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    const useDark = stored ? stored === 'dark' : prefersDark;
    setIsDark(useDark);
    if (useDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, []);

  useEffect(() => {
    // Responsive detection
    const onResize = () => setIsMobile(window.innerWidth < 1024);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    // Mock fetch
    setLoading(true);
    const timer = setTimeout(() => {
      setTransactions(MOCK_TRANSACTIONS);
      setLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  // Derived
  const filteredTransactions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return transactions
      .filter((t) => {
        // Search by description, category, tags
        if (q) {
          const hay = `${t.description} ${t.category} ${t.tags.join(' ')}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        if (filters.type !== 'all' && t.type !== filters.type) return false;
        if (filters.category !== 'all' && t.category !== filters.category) return false;
        if (filters.account !== 'all' && t.account !== filters.account) return false;
        if (filters.status !== 'all' && t.status !== filters.status) return false;

        // Amount range
        if (filters.amountRange.min !== null && t.amount < filters.amountRange.min) return false;
        if (filters.amountRange.max !== null && t.amount > filters.amountRange.max) return false;

        // Date range
        if (filters.dateRange !== 'all') {
          const txDate = new Date(t.date);
          const today = new Date();
          const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
          const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

          if (filters.dateRange === 'today') {
            if (txDate < startOfDay || txDate > endOfDay) return false;
          } else if (filters.dateRange === 'week') {
            const day = today.getDay();
            const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
            const weekStart = new Date(today.setDate(diff));
            weekStart.setHours(0, 0, 0, 0);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);
            weekEnd.setHours(23, 59, 59, 999);
            if (txDate < weekStart || txDate > weekEnd) return false;
          } else if (filters.dateRange === 'month') {
            const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
            const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
            if (txDate < monthStart || txDate > monthEnd) return false;
          } else if (filters.dateRange === 'custom') {
            const { start, end } = filters.customDateRange;
            if (start) {
              const s = new Date(start);
              if (txDate < s) return false;
            }
            if (end) {
              const e = new Date(end);
              e.setHours(23, 59, 59, 999);
              if (txDate > e) return false;
            }
          }
        }
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, searchQuery, filters]);

  const sortedTransactions = useMemo(() => {
    const list = [...filteredTransactions];
    list.sort((a, b) => {
      let aVal: number | string;
      let bVal: number | string;
      switch (sortBy) {
        case 'date':
          aVal = new Date(a.date).getTime();
          bVal = new Date(b.date).getTime();
          break;
        case 'amount':
          aVal = a.amount;
          bVal = b.amount;
          break;
        case 'category':
          aVal = a.category.toLowerCase();
          bVal = b.category.toLowerCase();
          break;
        default:
          aVal = 0;
          bVal = 0;
      }
      const cmp = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      return sortOrder === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [filteredTransactions, sortBy, sortOrder]);

  const totals = useMemo(() => {
    const income = filteredTransactions.filter((t) => t.type === 'Income').reduce((s, t) => s + t.amount, 0);
    const expenses = filteredTransactions.filter((t) => t.type === 'Expense').reduce((s, t) => s + t.amount, 0);
    const net = income - expenses;
    const count = filteredTransactions.length;
    return { income, expenses, net, count };
  }, [filteredTransactions]);

  // Handlers
  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const openModal = (tx?: Transaction) => {
    if (tx) {
      setEditingTransaction(tx);
      setFormData({
        type: tx.type,
        amount: tx.amount.toString(),
        description: tx.description,
        category: tx.category,
        date: tx.date,
        account: tx.account || '',
        paymentMethod: tx.paymentMethod,
        location: tx.location || '',
        tags: tx.tags || [],
        recurring: !!tx.recurring,
        frequency: (tx.frequency || '') as '' | Exclude<TxFrequency, undefined>,
        status: tx.status,
        receiptUrl: tx.receiptUrl || '',
        referenceNumber: tx.referenceNumber || '',
      });
    } else {
      setEditingTransaction(null);
      setFormData({
        type: 'Expense',
        amount: '',
        description: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        account: '',
        paymentMethod: 'Credit Card',
        location: '',
        tags: [],
        recurring: false,
        frequency: '',
        status: 'Completed',
        receiptUrl: '',
        referenceNumber: '',
      });
    }
    setFormErrors({});
    setModalStep(1);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormErrors({});
    setModalStep(1);
    setEditingTransaction(null);
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      errs.amount = 'Enter a valid amount';
    }
    if (!formData.description.trim()) errs.description = 'Description is required';
    if (!formData.category) errs.category = 'Select a category';
    if (!formData.account) errs.account = 'Select an account';
    if (!formData.date) errs.date = 'Date is required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    const updated: Transaction = {
      id: editingTransaction ? editingTransaction.id : `txn_${Date.now()}`,
      type: formData.type,
      amount: Number(formData.amount),
      description: formData.description,
      category: formData.category,
      date: formData.date,
      account: formData.account,
      paymentMethod: formData.paymentMethod,
      status: formData.status,
      location: formData.location || undefined,
      tags: formData.tags,
      recurring: formData.recurring,
      frequency: (formData.frequency || undefined) as TxFrequency,
      receiptUrl: formData.receiptUrl || undefined,
      referenceNumber: formData.referenceNumber || undefined,
    };
    setTransactions((prev) =>
      editingTransaction ? prev.map((t) => (t.id === editingTransaction.id ? updated : t)) : [updated, ...prev],
    );
    closeModal();
  };

  const toggleSelection = (id: string) => {
    const next = new Set(selectedTransactions);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedTransactions(next);
    setShowBulkActions(next.size > 0);
  };

  const selectAll = () => {
    if (selectedTransactions.size === sortedTransactions.length) {
      setSelectedTransactions(new Set());
      setShowBulkActions(false);
    } else {
      setSelectedTransactions(new Set(sortedTransactions.map((t) => t.id)));
      setShowBulkActions(true);
    }
  };

  const clearSelection = () => {
    setSelectedTransactions(new Set());
    setShowBulkActions(false);
  };

  const bulkDelete = () => {
    if (selectedTransactions.size === 0) return;
    const ok = confirm(`Delete ${selectedTransactions.size} selected transaction(s)?`);
    if (!ok) return;
    setTransactions((prev) => prev.filter((t) => !selectedTransactions.has(t.id)));
    clearSelection();
  };

  const deleteRow = (tx: Transaction) => {
    const ok = confirm(`Delete "${tx.description}"?`);
    if (!ok) return;
    setTransactions((prev) => prev.filter((t) => t.id !== tx.id));
    const next = new Set(selectedTransactions);
    next.delete(tx.id);
    setSelectedTransactions(next);
    setShowBulkActions(next.size > 0);
  };

  const exportCSV = () => {
    const chosen = sortedTransactions.filter((t) => selectedTransactions.has(t.id));
    const header = 'Date,Type,Amount,Description,Category,Account,Status,Tags\n';
    const lines = chosen.map(
      (t) =>
        `${t.date},${t.type},${t.amount},"${t.description.replace(/"/g, '""')}",${t.category},${t.account},${t.status},"${t.tags.join(
          ' ',
        )}"`,
    );
    const blob = new Blob([header + lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().substring(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importCSV = (file?: File) => {
    if (!file) return;
    alert(`Mock import: ${file.name} would be processed here`);
  };

  // Rendering
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-slate-100">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-gray-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:dark:bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          {/* Breadcrumbs and actions */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div>
              <nav className="flex items-center text-sm text-gray-500 dark:text-slate-400">
                <Link href="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Dashboard
                </Link>
                <ChevronRight className="mx-2 h-4 w-4" />
                <span className="text-gray-700 dark:text-slate-200 font-medium">Transactions</span>
              </nav>
              <h1 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Transactions
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle theme"
                title="Toggle theme"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                <span className="hidden sm:inline text-sm">{isDark ? 'Light' : 'Dark'} mode</span>
              </button>

              {/* Go to Analytics */}
              <Link
                href="/analyze"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                Go to Analytics
                <ArrowRight className="h-4 w-4" />
              </Link>

              {/* Add Transaction */}
              <button
                onClick={() => openModal()}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
              >
                <Filter className="h-4 w-4 opacity-70" />
                Add
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="relative w-full md:max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by description, category, or tag..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowStats((s) => !s)}
                className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                {showStats ? 'Hide' : 'Show'} Stats
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 lg:grid lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700 flex items-center gap-2">
              <Filter className="h-4 w-4 text-blue-600" />
              <h2 className="text-sm font-semibold">Filters</h2>
            </div>

            <div className="p-4 space-y-4">
              {/* Type */}
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-2">Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['all', 'Income', 'Expense'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilters((f) => ({ ...f, type } as TransactionFilters))}
                      className={classNames(
                        'px-2 py-2 rounded-lg text-xs border transition-colors',
                        filters.type === type
                          ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800'
                          : 'border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800',
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value as any }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  <option value="all">All</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Account */}
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-2">Account</label>
                <select
                  value={filters.account}
                  onChange={(e) => setFilters((f) => ({ ...f, account: e.target.value as any }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  <option value="all">All</option>
                  {ACCOUNTS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value as any }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  <option value="all">All</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-2">Amount</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.amountRange.min ?? ''}
                    onChange={(e) =>
                      setFilters((f) => ({
                        ...f,
                        amountRange: { ...f.amountRange, min: e.target.value ? Number(e.target.value) : null },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                  <span className="text-gray-400 dark:text-slate-500">—</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.amountRange.max ?? ''}
                    onChange={(e) =>
                      setFilters((f) => ({
                        ...f,
                        amountRange: { ...f.amountRange, max: e.target.value ? Number(e.target.value) : null },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-2">Date Range</label>
                <select
                  value={filters.dateRange}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      dateRange: e.target.value as DateRangePreset,
                      ...(e.target.value !== 'custom' ? { customDateRange: { start: '', end: '' } } : {}),
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="custom">Custom</option>
                </select>

                {filters.dateRange === 'custom' && (
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div className="relative">
                      <CalendarDays className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="date"
                        value={filters.customDateRange.start}
                        onChange={(e) =>
                          setFilters((f) => ({ ...f, customDateRange: { ...f.customDateRange, start: e.target.value } }))
                        }
                        className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                    </div>
                    <div className="relative">
                      <CalendarDays className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="date"
                        value={filters.customDateRange.end}
                        onChange={(e) =>
                          setFilters((f) => ({ ...f, customDateRange: { ...f.customDateRange, end: e.target.value } }))
                        }
                        className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Clear Filters */}
              <div className="pt-2">
                <button
                  onClick={() =>
                    setFilters({
                      type: 'all',
                      category: 'all',
                      account: 'all',
                      status: 'all',
                      dateRange: 'all',
                      customDateRange: { start: '', end: '' },
                      amountRange: { min: null, max: null },
                    })
                  }
                  className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <section className="lg:col-span-3 space-y-6">
          {/* KPI Cards */}
          {showStats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {loading ? (
                <>
                  <CardSkeleton />
                  <CardSkeleton />
                  <CardSkeleton />
                  <CardSkeleton />
                </>
              ) : (
                <>
                  <div className="p-4 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                    <div className="text-sm text-gray-500 dark:text-slate-400">Total Transactions</div>
                    <div className="mt-1 text-2xl font-semibold">{totals.count}</div>
                  </div>

                  <div className="p-4 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500 dark:text-slate-400">Income</div>
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div className="mt-1 text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(totals.income)}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500 dark:text-slate-400">Expenses</div>
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    </div>
                    <div className="mt-1 text-2xl font-semibold text-red-600 dark:text-red-400">
                      {formatCurrency(totals.expenses)}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500 dark:text-slate-400">Net</div>
                      <ArrowUpDown className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div
                      className={classNames(
                        'mt-1 text-2xl font-semibold',
                        totals.net >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400',
                      )}
                    >
                      {formatCurrency(totals.net)}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Transactions Header Controls */}
          <div className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                <List className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-slate-400">Recent Transactions</div>
                <div className="text-base font-semibold">
                  {loading ? 'Loading...' : `${sortedTransactions.length} found`}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Select All */}
              {!loading && sortedTransactions.length > 0 && (
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedTransactions.size === sortedTransactions.length && sortedTransactions.length > 0}
                    onChange={selectAll}
                    className="rounded border-gray-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                  />
                  Select All
                </label>
              )}

              {/* Sort */}
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [f, o] = e.target.value.split('-');
                  setSortBy(f as 'date' | 'amount' | 'category');
                  setSortOrder(o as 'asc' | 'desc');
                }}
                className="px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
              >
                <option value="date-desc">Date (Newest)</option>
                <option value="date-asc">Date (Oldest)</option>
                <option value="amount-desc">Amount (Highest)</option>
                <option value="amount-asc">Amount (Lowest)</option>
                <option value="category-asc">Category (A-Z)</option>
                <option value="category-desc">Category (Z-A)</option>
              </select>

              {/* Add */}
              <button
                onClick={() => openModal()}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                <Filter className="h-4 w-4 opacity-90" />
                Add Transaction
              </button>
            </div>
          </div>

          {/* Transactions List */}
          <div className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
            {loading ? (
              <>
                <RowSkeleton />
                <RowSkeleton />
                <RowSkeleton />
                <RowSkeleton />
                <RowSkeleton />
              </>
            ) : sortedTransactions.length === 0 ? (
              <div className="p-10 text-center">
                <Receipt className="h-10 w-10 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
                <div className="text-lg font-medium">No transactions found</div>
                <div className="text-sm text-gray-500 dark:text-slate-400">
                  Try adjusting search or filters to find what you need.
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-slate-800">
                {sortedTransactions.map((t, idx) => {
                  const statusChip = getStatusChip(t.status);
                  return (
                    <motion.div
                      key={t.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      className="group p-4 hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        {/* Left: select + icon + info */}
                        <div className="flex items-start gap-3 min-w-0">
                          <input
                            type="checkbox"
                            checked={selectedTransactions.has(t.id)}
                            onChange={() => toggleSelection(t.id)}
                            className="mt-2 rounded border-gray-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="mt-1">{getTransactionIcon(t.type)}</div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <div className="font-medium truncate">{t.description}</div>
                              <span
                                className={classNames(
                                  'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border',
                                  'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900',
                                )}
                              >
                                <Building className="h-3.5 w-3.5" />
                                {t.account}
                              </span>
                              <span
                                className={classNames(
                                  'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border',
                                  'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900',
                                )}
                              >
                                {getPaymentIcon(t.paymentMethod)}
                                {t.paymentMethod}
                              </span>
                              <span
                                className={classNames(
                                  'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border',
                                  statusChip.className,
                                )}
                              >
                                <statusChip.icon className="h-3.5 w-3.5" />
                                {t.status}
                              </span>
                            </div>

                            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-slate-400">
                              <span className="inline-flex items-center gap-1">
                                <CalendarDays className="h-4 w-4" />
                                {new Date(t.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  ...(new Date(t.date).getFullYear() !== new Date().getFullYear() && { year: 'numeric' }),
                                })}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <Tag className="h-4 w-4" />
                                <span className="truncate">{t.category}</span>
                              </span>
                              {t.location && (
                                <span className="inline-flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {t.location}
                                </span>
                              )}
                            </div>

                            {/* Tags */}
                            {t.tags?.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {t.tags.map((tag) => (
                                  <button
                                    key={tag}
                                    onClick={() => setSearchQuery(tag)}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                                    title="Filter by tag"
                                  >
                                    <Tag className="h-3.5 w-3.5" />
                                    {tag}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right: amount + actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="text-right mr-2">
                            <div className={classNames('text-sm font-semibold', getTypeColor(t.type))}>
                              {t.type === 'Income' ? '+' : t.type === 'Expense' ? '-' : ''}
                              {formatCurrency(Math.abs(t.amount))}
                            </div>
                            {t.recurring && (
                              <div className="mt-1 inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                                <Clock className="h-3 w-3" />
                                {t.frequency || 'Recurring'}
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => openModal(t)}
                            className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                            aria-label="Edit"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteRow(t)}
                            className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-red-600 dark:text-red-400 transition"
                            aria-label="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Load more (mock) */}
          {!loading && sortedTransactions.length > 0 && (
            <div className="text-center">
              <button className="px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                Load More
              </button>
            </div>
          )}
        </section>
      </div>

      {/* Bulk Actions Footer */}
      <AnimatePresence>
        {showBulkActions && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 shadow-lg"
          >
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
              <div className="text-sm">
                {selectedTransactions.size} selected
                <button onClick={clearSelection} className="ml-3 text-gray-500 hover:underline">
                  Clear
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={exportCSV}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </button>
                <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer transition-colors">
                  <Upload className="h-4 w-4" />
                  Import
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => importCSV(e.target.files?.[0])}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={bulkDelete}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Modal */}
      <Transition appear show={isModalOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto p-3 sm:p-6">
            <div className="flex min-h-full items-center justify-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 translate-y-3 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-3 sm:scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 shadow-xl">
                  {/* Header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-slate-700">
                    <Dialog.Title className="text-lg font-semibold">
                      {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
                    </Dialog.Title>
                    <button
                      onClick={closeModal}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                      aria-label="Close"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Stepper */}
                  <div className="px-5 py-3 border-b border-gray-200 dark:border-slate-700">
                    <div className="flex items-center justify-center gap-6">
                      {[
                        { step: 1, label: 'Basics', icon: FileText },
                        { step: 2, label: 'Details', icon: Info },
                        { step: 3, label: 'Confirm', icon: Check },
                      ].map(({ step, label, icon: Icon }) => (
                        <div key={step} className="flex flex-col items-center">
                          <div
                            className={classNames(
                              'w-10 h-10 rounded-full border-2 flex items-center justify-center',
                              modalStep >= step
                                ? 'bg-blue-600 border-blue-600 text-white'
                                : 'border-gray-300 dark:border-slate-600 text-gray-400',
                            )}
                          >
                            {modalStep > step ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                          </div>
                          <div
                            className={classNames(
                              'mt-2 text-xs font-medium',
                              modalStep >= step ? 'text-blue-600 dark:text-blue-300' : 'text-gray-400',
                            )}
                          >
                            {label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 min-h-[360px]">
                    {modalStep === 1 && (
                      <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                        {/* Type */}
                        <div>
                          <label className="block text-sm font-medium mb-2">Type *</label>
                          <div className="grid grid-cols-3 gap-2">
                            {(['Income', 'Expense', 'Transfer'] as const).map((type) => (
                              <button
                                key={type}
                                onClick={() => setFormData((f) => ({ ...f, type }))}
                                className={classNames(
                                  'p-3 rounded-lg border transition-colors flex flex-col items-center',
                                  formData.type === type
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                                    : 'border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800',
                                )}
                              >
                                {type === 'Income' ? (
                                  <TrendingUp className="h-5 w-5 mb-1" />
                                ) : type === 'Expense' ? (
                                  <TrendingDown className="h-5 w-5 mb-1" />
                                ) : (
                                  <ArrowUpDown className="h-5 w-5 mb-1" />
                                )}
                                <span className="text-sm font-medium">{type}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Amount */}
                        <div>
                          <label className="block text-sm font-medium mb-2">Amount *</label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                              type="number"
                              value={formData.amount}
                              onChange={(e) => setFormData((f) => ({ ...f, amount: e.target.value }))}
                              placeholder="0.00"
                              step="0.01"
                              className={classNames(
                                'w-full pl-8 pr-3 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500',
                                formErrors.amount
                                  ? 'border-red-300'
                                  : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900',
                              )}
                            />
                          </div>
                          {formErrors.amount && <p className="text-sm text-red-600 mt-1">{formErrors.amount}</p>}
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-sm font-medium mb-2">Description *</label>
                          <input
                            type="text"
                            value={formData.description}
                            onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))}
                            placeholder="What was this for?"
                            className={classNames(
                              'w-full px-3 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500',
                              formErrors.description
                                ? 'border-red-300'
                                : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900',
                            )}
                          />
                          {formErrors.description && (
                            <p className="text-sm text-red-600 mt-1">{formErrors.description}</p>
                          )}
                        </div>

                        {/* Category */}
                        <div>
                          <label className="block text-sm font-medium mb-2">Category *</label>
                          <select
                            value={formData.category}
                            onChange={(e) => setFormData((f) => ({ ...f, category: e.target.value }))}
                            className={classNames(
                              'w-full px-3 py-2 rounded-lg border',
                              formErrors.category
                                ? 'border-red-300'
                                : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900',
                            )}
                          >
                            <option value="">Select a category</option>
                            {CATEGORIES.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                          {formErrors.category && <p className="text-sm text-red-600 mt-1">{formErrors.category}</p>}
                        </div>

                        {/* Date */}
                        <div>
                          <label className="block text-sm font-medium mb-2">Date *</label>
                          <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData((f) => ({ ...f, date: e.target.value }))}
                            className={classNames(
                              'w-full px-3 py-2 rounded-lg border',
                              formErrors.date
                                ? 'border-red-300'
                                : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900',
                            )}
                          />
                          {formErrors.date && <p className="text-sm text-red-600 mt-1">{formErrors.date}</p>}
                        </div>
                      </motion.div>
                    )}

                    {modalStep === 2 && (
                      <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                        {/* Account */}
                        <div>
                          <label className="block text-sm font-medium mb-2">Account *</label>
                          <select
                            value={formData.account}
                            onChange={(e) => setFormData((f) => ({ ...f, account: e.target.value }))}
                            className={classNames(
                              'w-full px-3 py-2 rounded-lg border',
                              formErrors.account
                                ? 'border-red-300'
                                : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900',
                            )}
                          >
                            <option value="">Select an account</option>
                            {ACCOUNTS.map((a) => (
                              <option key={a} value={a}>
                                {a}
                              </option>
                            ))}
                          </select>
                          {formErrors.account && <p className="text-sm text-red-600 mt-1">{formErrors.account}</p>}
                        </div>

                        {/* Payment method */}
                        <div>
                          <label className="block text-sm font-medium mb-2">Payment Method</label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {PAYMENT_METHODS.map((pm) => (
                              <button
                                key={pm}
                                onClick={() => setFormData((f) => ({ ...f, paymentMethod: pm }))}
                                className={classNames(
                                  'p-3 rounded-lg border flex items-center justify-center gap-2',
                                  formData.paymentMethod === pm
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                                    : 'border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800',
                                )}
                                type="button"
                              >
                                {getPaymentIcon(pm)}
                                <span className="text-xs">{pm}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Location */}
                        <div>
                          <label className="block text-sm font-medium mb-2">Location</label>
                          <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData((f) => ({ ...f, location: e.target.value }))}
                            placeholder="Optional"
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                          />
                        </div>

                        {/* Tags */}
                        <div>
                          <label className="block text-sm font-medium mb-2">Tags</label>
                          <input
                            type="text"
                            placeholder="Comma separated (e.g. Groceries, Family)"
                            onChange={(e) =>
                              setFormData((f) => ({
                                ...f,
                                tags: e.target.value
                                  .split(',')
                                  .map((x) => x.trim())
                                  .filter(Boolean),
                              }))
                            }
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                          />
                          {formData.tags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {formData.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                                >
                                  <Tag className="h-3.5 w-3.5" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Recurring */}
                        <div className="space-y-3">
                          <label className="inline-flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={formData.recurring}
                              onChange={(e) => setFormData((f) => ({ ...f, recurring: e.target.checked }))}
                              className="rounded border-gray-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm">Recurring</span>
                          </label>

                          {formData.recurring && (
                            <div>
                              <label className="block text-sm font-medium mb-2">Frequency</label>
                              <select
                                value={formData.frequency}
                                onChange={(e) =>
                                  setFormData((f) => ({ ...f, frequency: e.target.value as any }))
                                }
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                              >
                                <option value="">Select frequency</option>
                                <option value="Daily">Daily</option>
                                <option value="Weekly">Weekly</option>
                                <option value="Monthly">Monthly</option>
                              </select>
                            </div>
                          )}
                        </div>

                        {/* Status */}
                        <div>
                          <label className="block text-sm font-medium mb-2">Status</label>
                          <select
                            value={formData.status}
                            onChange={(e) => setFormData((f) => ({ ...f, status: e.target.value as TxStatus }))}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                          >
                            <option value="Completed">Completed</option>
                            <option value="Pending">Pending</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>

                        {/* Receipt and Ref */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium mb-2">Receipt</label>
                            <button
                              type="button"
                              onClick={() =>
                                setFormData((f) => ({ ...f, receiptUrl: `https://example.com/rcpt_${Date.now()}.pdf` }))
                              }
                              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800"
                            >
                              <Camera className="h-4 w-4" />
                              {formData.receiptUrl ? 'Receipt Uploaded' : 'Upload Receipt (mock)'}
                            </button>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Reference Number</label>
                            <input
                              type="text"
                              value={formData.referenceNumber}
                              onChange={(e) => setFormData((f) => ({ ...f, referenceNumber: e.target.value }))}
                              placeholder="Optional"
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {modalStep === 3 && (
                      <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                        <div className="text-center">
                          <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                            <Check className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                          </div>
                          <div className="mt-2 text-lg font-semibold">
                            {editingTransaction ? 'Review Update' : 'Review Details'}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-slate-400">
                            Confirm the information before submitting
                          </div>
                        </div>
                        <div className="rounded-lg bg-gray-50 dark:bg-slate-800/60 p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div>
                            <div className="text-gray-500 dark:text-slate-400">Type</div>
                            <div className="font-medium">{formData.type}</div>
                          </div>
                          <div>
                            <div className="text-gray-500 dark:text-slate-400">Amount</div>
                            <div className="font-medium">{formatCurrency(Number(formData.amount || 0))}</div>
                          </div>
                          <div>
                            <div className="text-gray-500 dark:text-slate-400">Description</div>
                            <div className="font-medium">{formData.description}</div>
                          </div>
                          <div>
                            <div className="text-gray-500 dark:text-slate-400">Category</div>
                            <div className="font-medium">{formData.category || '-'}</div>
                          </div>
                          <div>
                            <div className="text-gray-500 dark:text-slate-400">Date</div>
                            <div className="font-medium">{formData.date}</div>
                          </div>
                          <div>
                            <div className="text-gray-500 dark:text-slate-400">Account</div>
                            <div className="font-medium">{formData.account || '-'}</div>
                          </div>
                          {formData.tags.length > 0 && (
                            <div className="sm:col-span-2">
                              <div className="text-gray-500 dark:text-slate-400">Tags</div>
                              <div className="mt-1 flex flex-wrap gap-1.5">
                                {formData.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                                  >
                                    <Tag className="h-3.5 w-3.5" />
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="px-5 py-4 border-t border-gray-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      {modalStep > 1 && (
                        <button
                          onClick={() => setModalStep((s) => Math.max(1, s - 1))}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Back
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={closeModal}
                        className="px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800"
                      >
                        Cancel
                      </button>
                      {modalStep < 3 ? (
                        <button
                          onClick={() => setModalStep((s) => Math.min(3, s + 1))}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={handleSubmit}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Check className="h-4 w-4" />
                          {editingTransaction ? 'Update' : 'Create'}
                        </button>
                      )}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
