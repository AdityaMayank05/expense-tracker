// components/transactions/TransactionStats.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  CreditCard,
  MapPin,
  Tag
} from 'lucide-react';
import { Transaction } from '@/types/transaction';

interface TransactionStatsProps {
  transactions: Transaction[];
}

const TransactionStats: React.FC<TransactionStatsProps> = ({ transactions }) => {
  // Calculate various statistics
  const totalTransactions = transactions.length;
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const avgTransactionAmount = totalTransactions > 0 ? (totalIncome + totalExpenses) / totalTransactions : 0;

  // Category analysis
  const categoryStats = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      if (!acc[t.category]) {
        acc[t.category] = { amount: 0, count: 0 };
      }
      acc[t.category].amount += t.amount;
      acc[t.category].count += 1;
      return acc;
    }, {} as Record<string, { amount: number; count: number }>);

  const topCategories = Object.entries(categoryStats)
    .sort(([,a], [,b]) => b.amount - a.amount)
    .slice(0, 5);

  // Payment method analysis
  const paymentMethodStats = transactions.reduce((acc, t) => {
    acc[t.paymentMethod] = (acc[t.paymentMethod] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topPaymentMethods = Object.entries(paymentMethodStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  // Monthly comparison
  const currentMonth = new Date().getMonth();
  const currentMonthTransactions = transactions.filter(t => 
    new Date(t.date).getMonth() === currentMonth
  );
  const lastMonthTransactions = transactions.filter(t => 
    new Date(t.date).getMonth() === currentMonth - 1
  );

  const currentMonthExpenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const lastMonthExpenses = lastMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyChange = lastMonthExpenses > 0 
    ? ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 
    : 0;

  // Most frequent locations
  const locationStats = transactions
    .filter(t => t.location)
    .reduce((acc, t) => {
      if (t.location) {
        acc[t.location] = (acc[t.location] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

  const topLocations = Object.entries(locationStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
            <p className="text-xs text-muted-foreground">
              This period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Amount</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(avgTransactionAmount)}</div>
            <p className="text-xs text-muted-foreground">
              Per transaction
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Change</CardTitle>
            {monthlyChange >= 0 ? (
              <TrendingUp className="h-4 w-4 text-red-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-green-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${monthlyChange >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              {monthlyChange >= 0 ? '+' : ''}{monthlyChange.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              vs last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recurring</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {transactions.filter(t => t.recurring).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Recurring transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Top Spending Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topCategories.map(([category, stats], index) => {
              const percentage = (stats.amount / totalExpenses) * 100;
              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <span className="font-medium">{category}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(stats.amount)}</div>
                      <div className="text-xs text-muted-foreground">{stats.count} transactions</div>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                  <div className="text-xs text-muted-foreground text-right">
                    {percentage.toFixed(1)}% of total expenses
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods & Locations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Payment Methods</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPaymentMethods.map(([method, count]) => (
                <div key={method} className="flex items-center justify-between">
                  <span className="capitalize font-medium">
                    {method.replace('_', ' ')}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{count}</Badge>
                    <div className="text-sm text-muted-foreground">
                      {((count / totalTransactions) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Top Locations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topLocations.length > 0 ? (
                topLocations.map(([location, count]) => (
                  <div key={location} className="flex items-center justify-between">
                    <span className="font-medium truncate">{location}</span>
                    <Badge variant="secondary">{count} visits</Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No location data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {['completed', 'pending', 'cancelled'].map(status => {
              const count = transactions.filter(t => t.status === status).length;
              const percentage = (count / totalTransactions) * 100;
              const colors = {
                completed: 'text-green-600 bg-green-50 border-green-200',
                pending: 'text-yellow-600 bg-yellow-50 border-yellow-200',
                cancelled: 'text-red-600 bg-red-50 border-red-200',
              };
              
              return (
                <div key={status} className={`p-4 rounded-lg border ${colors[status as keyof typeof colors]}`}>
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-sm font-medium capitalize">{status}</div>
                  <div className="text-xs opacity-75">{percentage.toFixed(1)}%</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionStats;
