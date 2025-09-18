// components/transactions/TransactionsList.tsx
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MoreHorizontal, 
  Edit3, 
  Trash2, 
  Copy, 
  MapPin,
  Receipt,
  Repeat,
  CreditCard,
  Banknote,
  Smartphone,
  University
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Transaction } from '@/types/transaction';
import { format } from 'date-fns';

interface TransactionsListProps {
  transactions: Transaction[];
  selectedTransactions: string[];
  onSelectionChange: (selected: string[]) => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const paymentMethodIcons = {
  cash: Banknote,
  credit_card: CreditCard,
  debit_card: CreditCard,
  bank_transfer: University,
  check: Receipt,
  digital_wallet: Smartphone,
  direct_deposit: University,
  auto_pay: Repeat,
  transfer: University,
};

const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions,
  selectedTransactions,
  onSelectionChange,
  onEdit,
  onDelete
}) => {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(transactions.map(t => t.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectTransaction = (id: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedTransactions, id]);
    } else {
      onSelectionChange(selectedTransactions.filter(tid => tid !== id));
    }
  };

  const getTypeColor = (type: Transaction['type']) => {
    switch (type) {
      case 'income': return 'text-green-600 bg-green-50 border-green-200';
      case 'expense': return 'text-red-600 bg-red-50 border-red-200';
      case 'transfer': return 'text-primary bg-primary/10 border-primary/20';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions found</h3>
          <p className="text-gray-600">Try adjusting your search or filters to find transactions.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center space-x-3">
            <Checkbox
              checked={selectedTransactions.length === transactions.length}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm font-medium">
              {selectedTransactions.length > 0 
                ? `${selectedTransactions.length} selected`
                : `${transactions.length} transactions`
              }
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
            <span className="w-24">Date</span>
            <span className="w-32">Category</span>
            <span className="w-24">Amount</span>
            <span className="w-20">Status</span>
          </div>
        </div>

        {/* Transaction List */}
        <div className="divide-y">
          {transactions.map((transaction) => {
            const PaymentIcon = paymentMethodIcons[transaction.paymentMethod];
            const isSelected = selectedTransactions.includes(transaction.id);

            return (
              <div
                key={transaction.id}
                className={`flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                  isSelected ? 'bg-primary/10 border-l-4 border-l-primary' : ''
                }`}
              >
                <div className="flex items-center space-x-3 flex-1">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => handleSelectTransaction(transaction.id, checked as boolean)}
                  />
                  
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    {/* Payment Method Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <PaymentIcon className="h-4 w-4 text-gray-600" />
                      </div>
                    </div>

                    {/* Transaction Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {transaction.description}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className={getTypeColor(transaction.type)}>
                              {transaction.type}
                            </Badge>
                            <span className="text-xs text-gray-500">{transaction.category}</span>
                            {transaction.location && (
                              <div className="flex items-center text-xs text-gray-500">
                                <MapPin className="h-3 w-3 mr-1" />
                                {transaction.location}
                              </div>
                            )}
                            {transaction.recurring && (
                              <Repeat className="h-3 w-3 text-primary" />
                            )}
                          </div>
                          
                          {/* Tags */}
                          {transaction.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {transaction.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Amount and Date - Desktop */}
                        <div className="hidden md:flex items-center space-x-4 ml-4">
                          <div className="text-right">
                            <div className="text-sm text-gray-500">
                              {format(new Date(transaction.date), 'MMM dd')}
                            </div>
                            <div className="text-xs text-gray-400">
                              {format(new Date(transaction.date), 'yyyy')}
                            </div>
                          </div>
                          
                          <div className="w-32 text-right">
                            <div className="text-sm text-gray-600">{transaction.category}</div>
                            <div className="text-xs text-gray-400">{transaction.account}</div>
                          </div>
                          
                          <div className="w-24 text-right">
                            <div className={`text-sm font-semibold ${
                              transaction.type === 'income' ? 'text-green-600' : 
                              transaction.type === 'expense' ? 'text-red-600' : 'text-primary'
                            }`}>
                              {transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '-' : ''}
                              {formatCurrency(transaction.amount)}
                            </div>
                          </div>
                          
                          <div className="w-20">
                            <Badge className={getStatusColor(transaction.status)}>
                              {transaction.status}
                            </Badge>
                          </div>
                        </div>

                        {/* Amount and Date - Mobile */}
                        <div className="md:hidden text-right">
                          <div className={`text-sm font-semibold ${
                            transaction.type === 'income' ? 'text-green-600' : 
                            transaction.type === 'expense' ? 'text-red-600' : 'text-blue-600'
                          }`}>
                            {transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '-' : ''}
                            {formatCurrency(transaction.amount)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {format(new Date(transaction.date), 'MMM dd, yyyy')}
                          </div>
                          <Badge className={`${getStatusColor(transaction.status)} mt-1`}>
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions Menu */}
                <div className="flex-shrink-0 ml-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingTransaction(transaction)}>
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        navigator.clipboard.writeText(transaction.description);
                      }}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Description
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDelete(transaction.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionsList;
