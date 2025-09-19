'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Bell, 
  Search, 
  Plus, 
  Moon, 
  Sun,
  User,
  AlertTriangle,
  X,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  PieChart,
  Activity,
  CreditCard,
  Wallet,
  Calendar,
  Filter,
  Download,
  Settings
} from 'lucide-react';
import { Line, Pie, Bar, Doughnut } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  Filler
} from 'chart.js';
import { useFinancialData } from '@/providers/FinancialDataProvider';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  Filler
);

// TypeScript interfaces
interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  status: 'completed' | 'pending';
}

interface DashboardWidget {
  id: string;
  type: 'summary-card' | 'chart';
  title: string;
  component: React.ReactNode;
  gridSpan: string;
}

interface Alert {
  id: string;
  type: 'warning' | 'info' | 'success';
  title: string;
  description: string;
  dismissible: boolean;
}

// Drag and Drop Types
const ItemTypes = {
  WIDGET: 'widget',
};

// Mock Data
const mockTransactions: Transaction[] = [
  { id: '1', date: '2025-09-18', description: 'Grocery Shopping', amount: -85.50, category: 'Food', type: 'expense', status: 'completed' },
  { id: '2', date: '2025-09-17', description: 'Salary Deposit', amount: 3500.00, category: 'Salary', type: 'income', status: 'completed' },
  { id: '3', date: '2025-09-16', description: 'Gas Station', amount: -45.20, category: 'Transport', type: 'expense', status: 'completed' },
  { id: '4', date: '2025-09-15', description: 'Coffee Shop', amount: -12.80, category: 'Food', type: 'expense', status: 'completed' },
  { id: '5', date: '2025-09-14', description: 'Online Shopping', amount: -128.99, category: 'Shopping', type: 'expense', status: 'pending' },
  { id: '6', date: '2025-09-13', description: 'Freelance Work', amount: 750.00, category: 'Freelance', type: 'income', status: 'completed' },
  { id: '7', date: '2025-09-12', description: 'Netflix Subscription', amount: -15.99, category: 'Entertainment', type: 'expense', status: 'completed' },
  { id: '8', date: '2025-09-11', description: 'Electric Bill', amount: -89.45, category: 'Utilities', type: 'expense', status: 'completed' },
  { id: '9', date: '2025-09-10', description: 'Restaurant', amount: -67.30, category: 'Food', type: 'expense', status: 'completed' },
  { id: '10', date: '2025-09-09', description: 'Investment Return', amount: 245.75, category: 'Investment', type: 'income', status: 'completed' },
];

const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Budget Alert',
    description: 'You\'ve spent 85% of your Food budget this month.',
    dismissible: true,
  },
  {
    id: '2',
    type: 'info',
    title: 'Savings Goal',
    description: 'You\'re $150 away from your emergency fund goal!',
    dismissible: true,
  },
  {
    id: '3',
    type: 'success',
    title: 'Great Job!',
    description: 'You saved 20% more than last month.',
    dismissible: true,
  },
];

// Draggable Widget Component
const DraggableWidget: React.FC<{ widget: DashboardWidget; index: number; moveWidget: (dragIndex: number, hoverIndex: number) => void }> = ({
  widget,
  index,
  moveWidget,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.WIDGET,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.WIDGET,
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        moveWidget(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const attachRef = (node: HTMLDivElement | null) => {
    drag(drop(node));
  };

  return (
    <motion.div
      ref={attachRef}
      className={`${widget.gridSpan} ${isDragging ? 'opacity-50' : ''} cursor-move`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {widget.component}
    </motion.div>
  );
};

// Summary Card Component
const SummaryCard: React.FC<{
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: React.ReactNode;
  sparklineData?: number[];
  darkMode?: boolean;
}> = ({ title, value, change, changeType, icon, sparklineData, darkMode = false }) => {
  const sparklineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
    elements: {
      point: { radius: 0 },
      line: { tension: 0.4 },
    },
  };

  const sparklineChartData = {
    labels: Array.from({ length: 7 }, (_, i) => `Day ${i + 1}`),
    datasets: [
      {
        data: sparklineData || [65, 59, 80, 81, 56, 55, 40],
        borderColor: changeType === 'positive' ? '#10B981' : '#EF4444',
        backgroundColor: changeType === 'positive' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        fill: true,
        borderWidth: 2,
      },
    ],
  };

  return (
    <Card className={`border transition-all duration-300 ${
      darkMode 
        ? 'bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 hover:shadow-lg hover:shadow-emerald-500/10' 
        : 'bg-white border-gray-200 hover:shadow-lg hover:shadow-blue-500/10'
    }`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl border transition-colors ${
              darkMode
                ? 'bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border-emerald-400/20'
                : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'
            }`}>
              {icon}
            </div>
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{title}</p>
              <p className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`flex items-center text-sm font-medium ${
              changeType === 'positive' 
                ? (darkMode ? 'text-emerald-400' : 'text-green-600')
                : (darkMode ? 'text-red-400' : 'text-red-600')
            }`}>
              {changeType === 'positive' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              {change}
            </div>
            {sparklineData && (
              <div className="w-20 h-10 mt-2">
                <Line data={sparklineChartData} options={sparklineOptions} />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function DashboardPage() {
  const { financialData, isLoading } = useFinancialData();
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState(mockTransactions);
  const [alerts, setAlerts] = useState(mockAlerts);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);

  // Initialize data loading simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setDataLoaded(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Dark mode persistence - default to dark mode
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    // If no preference is saved, default to dark mode (true)
    // If preference is saved, use the saved value
    const isDarkMode = savedDarkMode === null ? true : savedDarkMode === 'true';
    setDarkMode(isDarkMode);
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Filter transactions
  useEffect(() => {
    const filtered = mockTransactions.filter(transaction =>
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTransactions(filtered);
  }, [searchTerm]);

  // Chart data
  const spendingTrendData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Daily Spending',
        data: [150, 230, 180, 310, 200, 180, 120],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const categoryBreakdownData = {
    labels: ['Food', 'Transport', 'Entertainment', 'Shopping', 'Utilities'],
    datasets: [
      {
        data: [35, 20, 15, 20, 10],
        backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'],
        borderWidth: 0,
      },
    ],
  };

  const incomeExpenseData = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        label: 'This Month',
        data: [4500, 2800],
        backgroundColor: ['#10B981', '#EF4444'],
        borderWidth: 0,
      },
    ],
  };

  const budgetOverviewData = {
    labels: ['Used', 'Remaining'],
    datasets: [
      {
        data: [75, 25],
        backgroundColor: ['#3B82F6', '#F3F4F6'],
        borderWidth: 0,
      },
    ],
  };

  // Initialize widgets
  useEffect(() => {
    const initialWidgets: DashboardWidget[] = [
      {
        id: 'balance',
        type: 'summary-card',
        title: 'Current Balance',
        gridSpan: 'col-span-1',
        component: (
          <SummaryCard
            title="Current Balance"
            value={`₹${financialData.totalBalance.toLocaleString()}`}
            change="+5.2%"
            changeType="positive"
            icon={<DollarSign className="w-6 h-6 text-primary" />}
            sparklineData={[45, 52, 48, 61, 55, 67, 69]}
            darkMode={darkMode}
          />
        ),
      },
      {
        id: 'income-expenses',
        type: 'summary-card',
        title: 'Income vs Expenses',
        gridSpan: 'col-span-1',
        component: (
          <SummaryCard
            title="Income vs Expenses"
            value="₹1,700"
            change="+12.3%"
            changeType="positive"
            icon={<BarChart3 className="w-6 h-6 text-green-600" />}
            darkMode={darkMode}
          />
        ),
      },
      {
        id: 'budget-overview',
        type: 'summary-card',
        title: 'Budget Overview',
        gridSpan: 'col-span-1',
        component: (
          <Card className={`border transition-all duration-300 ${
            darkMode 
              ? 'bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 hover:shadow-lg hover:shadow-blue-500/10' 
              : 'bg-white border-gray-200 hover:shadow-lg hover:shadow-blue-500/10'
          }`}>
            <CardHeader className="pb-3">
              <CardTitle className={`text-lg flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <Target className={`w-5 h-5 mr-2 ${darkMode ? 'text-primary' : 'text-primary'}`} />
                Budget Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center mb-4">
                <div className="w-32 h-32">
                  <Doughnut data={budgetOverviewData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                </div>
              </div>
              <div className="text-center">
                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>75%</p>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Used this month</p>
                <div className="mt-3 flex items-center justify-center space-x-4 text-xs">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-primary mr-1"></div>
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Used</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-1 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Remaining</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ),
      },
      {
        id: 'top-categories',
        type: 'summary-card',
        title: 'Top Categories',
        gridSpan: 'col-span-1',
        component: (
          <Card className={`border transition-all duration-300 ${
            darkMode 
              ? 'bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 hover:shadow-lg hover:shadow-purple-500/10' 
              : 'bg-white border-gray-200 hover:shadow-lg hover:shadow-purple-500/10'
          }`}>
            <CardHeader className="pb-3">
              <CardTitle className={`text-lg flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <PieChart className={`w-5 h-5 mr-2 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                Top Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className={`flex justify-between items-center py-2 px-3 rounded-lg ${darkMode ? 'bg-white/10' : 'bg-gray-50'}`}>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Food</span>
                  </div>
                  <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>40%</span>
                </div>
                <div className={`flex justify-between items-center py-2 px-3 rounded-lg ${darkMode ? 'bg-white/10' : 'bg-gray-50'}`}>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Transport</span>
                  </div>
                  <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>25%</span>
                </div>
                <div className={`flex justify-between items-center py-2 px-3 rounded-lg ${darkMode ? 'bg-white/10' : 'bg-gray-50'}`}>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Shopping</span>
                  </div>
                  <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>20%</span>
                </div>
                <div className={`flex justify-between items-center py-2 px-3 rounded-lg ${darkMode ? 'bg-white/10' : 'bg-gray-50'}`}>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Others</span>
                  </div>
                  <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>15%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ),
      },
    ];
    setWidgets(initialWidgets);
  }, [financialData, darkMode]);

  const moveWidget = (dragIndex: number, hoverIndex: number) => {
    const draggedWidget = widgets[dragIndex];
    const newWidgets = [...widgets];
    newWidgets.splice(dragIndex, 1);
    newWidgets.splice(hoverIndex, 0, draggedWidget);
    setWidgets(newWidgets);
  };

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  if (isLoading || !dataLoaded) {
    return (
      <div className={`min-h-screen p-6 ${darkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white relative overflow-hidden' : 'bg-background'}`}>
        {darkMode && (
          <>
            {/* Background Effects for Dark Mode */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-50"></div>
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
          </>
        )}
        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 text-white relative overflow-hidden' : 'bg-background'}`}>
        {darkMode && (
          <>
            {/* Background Effects for Dark Mode */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-50"></div>
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
          </>
        )}
        {/* Top Header Bar */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`fixed top-0 left-0 md:left-64 right-0 border-b px-6 py-5 flex items-center justify-between shadow-sm z-50 ${
            darkMode 
              ? 'bg-white/5 border-white/10 backdrop-blur-sm' 
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="This Month">This Month</SelectItem>
                <SelectItem value="This Quarter">This Quarter</SelectItem>
                <SelectItem value="This Year">This Year</SelectItem>
                <SelectItem value="Last Month">Last Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </div>
            
            <Popover open={showNotifications} onOpenChange={setShowNotifications}>
              <PopoverTrigger asChild>
                <Button className="relative bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300" variant="outline" size="icon">
                  <Bell className="w-5 h-5" />
                  {alerts.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs bg-red-500 text-white">{alerts.length}</Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700" align="end">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{alerts.length} new notifications</p>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {alerts.length > 0 ? (
                    <div className="p-2">
                      {alerts.map((alert, index) => (
                        <motion.div
                          key={alert.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-3 rounded-lg mb-2 border-l-4 ${
                            alert.type === 'warning'
                              ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-400 dark:from-yellow-900/20 dark:to-amber-900/20 dark:border-yellow-400'
                              : alert.type === 'info'
                              ? 'bg-gradient-to-r from-primary/10 to-primary/20 border-primary dark:from-primary/10 dark:to-primary/20 dark:border-primary'
                              : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-400 dark:from-green-900/20 dark:to-emerald-900/20 dark:border-green-400'
                          } hover:bg-opacity-80 transition-colors group`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div className={`p-1.5 rounded-lg ${
                                alert.type === 'warning'
                                  ? 'bg-yellow-100 dark:bg-yellow-900/30'
                                  : alert.type === 'info'
                                  ? 'bg-primary/20 dark:bg-primary/30'
                                  : 'bg-green-100 dark:bg-green-900/30'
                              }`}>
                                {alert.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />}
                                {alert.type === 'info' && <Activity className="w-4 h-4 text-primary dark:text-primary" />}
                                {alert.type === 'success' && <Target className="w-4 h-4 text-green-600 dark:text-green-400" />}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-sm text-gray-900 dark:text-white">{alert.title}</h4>
                                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{alert.description}</p>
                              </div>
                            </div>
                            {alert.dismissible && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => dismissAlert(alert.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 p-1 h-auto"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">No new notifications</p>
                    </div>
                  )}
                </div>
                {alerts.length > 0 && (
                  <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      onClick={() => setAlerts([])}
                    >
                      Clear all notifications
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>

            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <Sun className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              <Moon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </div>

            <Dialog open={showAddExpenseModal} onOpenChange={setShowAddExpenseModal}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white dark:bg-gray-800">
                <DialogHeader>
                  <DialogTitle className="text-gray-900 dark:text-white">Add New Expense</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input placeholder="Description" className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                  <Input placeholder="Amount" type="number" className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                  <Select>
                    <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="transport">Transport</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                      <SelectItem value="shopping">Shopping</SelectItem>
                      <SelectItem value="utilities">Utilities</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Add Expense</Button>
                </div>
              </DialogContent>
            </Dialog>

            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </motion.header>

        <div className="pt-24 p-6 max-w-7xl mx-auto relative z-10">
          {/* Summary Cards Section - Draggable */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Financial Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {widgets.map((widget, index) => (
                <DraggableWidget
                  key={widget.id}
                  widget={widget}
                  index={index}
                  moveWidget={moveWidget}
                />
              ))}
            </div>
          </motion.div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900 dark:text-white">
                    <Activity className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                    Spending Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Line
                      data={spendingTrendData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false },
                          tooltip: {
                            backgroundColor: darkMode ? '#374151' : '#ffffff',
                            titleColor: darkMode ? '#ffffff' : '#000000',
                            bodyColor: darkMode ? '#ffffff' : '#000000',
                            borderColor: darkMode ? '#4b5563' : '#e5e7eb',
                            borderWidth: 1,
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            grid: { color: darkMode ? '#374151' : '#f3f4f6' },
                            ticks: { color: darkMode ? '#9ca3af' : '#6b7280' },
                          },
                          x: {
                            grid: { color: darkMode ? '#374151' : '#f3f4f6' },
                            ticks: { color: darkMode ? '#9ca3af' : '#6b7280' },
                          },
                        },
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900 dark:text-white">
                    <PieChart className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                    Category Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Pie
                      data={categoryBreakdownData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom',
                            labels: { color: darkMode ? '#ffffff' : '#000000', padding: 20 },
                          },
                          tooltip: {
                            backgroundColor: darkMode ? '#374151' : '#ffffff',
                            titleColor: darkMode ? '#ffffff' : '#000000',
                            bodyColor: darkMode ? '#ffffff' : '#000000',
                            borderColor: darkMode ? '#4b5563' : '#e5e7eb',
                            borderWidth: 1,
                          },
                        },
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900 dark:text-white">
                    <BarChart3 className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                    Income vs Expenses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Bar
                      data={incomeExpenseData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false },
                          tooltip: {
                            backgroundColor: darkMode ? '#374151' : '#ffffff',
                            titleColor: darkMode ? '#ffffff' : '#000000',
                            bodyColor: darkMode ? '#ffffff' : '#000000',
                            borderColor: darkMode ? '#4b5563' : '#e5e7eb',
                            borderWidth: 1,
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            grid: { color: darkMode ? '#374151' : '#f3f4f6' },
                            ticks: { color: darkMode ? '#9ca3af' : '#6b7280' },
                          },
                          x: {
                            grid: { color: darkMode ? '#374151' : '#f3f4f6' },
                            ticks: { color: darkMode ? '#9ca3af' : '#6b7280' },
                          },
                        },
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900 dark:text-white">
                    <TrendingUp className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                    Forecast
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Line
                      data={{
                        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Projected'],
                        datasets: [
                          {
                            label: 'Predicted Spending',
                            data: [800, 750, 920, 680, 750],
                            borderColor: '#6366F1',
                            backgroundColor: 'rgba(99, 102, 241, 0.1)',
                            fill: true,
                            tension: 0.4,
                            borderDash: [0, 0, 0, 0, 5],
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false },
                          tooltip: {
                            backgroundColor: darkMode ? '#374151' : '#ffffff',
                            titleColor: darkMode ? '#ffffff' : '#000000',
                            bodyColor: darkMode ? '#ffffff' : '#000000',
                            borderColor: darkMode ? '#4b5563' : '#e5e7eb',
                            borderWidth: 1,
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            grid: { color: darkMode ? '#374151' : '#f3f4f6' },
                            ticks: { color: darkMode ? '#9ca3af' : '#6b7280' },
                          },
                          x: {
                            grid: { color: darkMode ? '#374151' : '#f3f4f6' },
                            ticks: { color: darkMode ? '#9ca3af' : '#6b7280' },
                          },
                        },
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-6"
          >
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-gray-900 dark:text-white">Recent Transactions</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <Filter className="w-4 h-4 mr-1" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm" className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <Download className="w-4 h-4 mr-1" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredTransactions.slice(0, 5).map((transaction, index) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border border-gray-100 dark:border-gray-700/50"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-xl ${
                          transaction.type === 'income' 
                            ? 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800' 
                            : 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-800'
                        }`}>
                          {transaction.type === 'income' ? (
                            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                          ) : (
                            <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{transaction.description}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.category} • {transaction.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`font-bold text-lg ${
                          transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {formatCurrency(transaction.amount)}
                        </span>
                        <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'} className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                          {transaction.status}
                        </Badge>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex justify-center space-x-4"
          >
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline">
              <Target className="w-4 h-4 mr-2" />
              Set Budget
            </Button>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </motion.div>
        </div>
      </div>
    </DndProvider>
  );
}