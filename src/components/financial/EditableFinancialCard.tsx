'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit2, Check, X, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, validateFinancialInput } from '@/lib/financialStorage';

interface EditableFinancialCardProps {
  title: string;
  value: number;
  changePercentage?: number;
  changeDirection?: 'up' | 'down';
  icon?: 'dollar' | 'trending-up' | 'trending-down';
  iconColor?: string;
  onSave: (newValue: number) => void;
  isLoading?: boolean;
}

export const EditableFinancialCard: React.FC<EditableFinancialCardProps> = ({
  title,
  value,
  changePercentage,
  changeDirection,
  icon = 'dollar',
  iconColor = 'text-emerald-400',
  onSave,
  isLoading = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value.toString());
  const [error, setError] = useState('');

  const getIcon = () => {
    switch (icon) {
      case 'trending-up':
        return <TrendingUp className={`h-4 w-4 ${iconColor}`} />;
      case 'trending-down':
        return <TrendingDown className={`h-4 w-4 ${iconColor}`} />;
      default:
        return <DollarSign className={`h-4 w-4 ${iconColor}`} />;
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(value.toString());
    setError('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(value.toString());
    setError('');
  };

  const handleSave = () => {
    const validation = validateFinancialInput(editValue);
    
    if (!validation.isValid) {
      setError('Please enter a valid amount');
      return;
    }

    if (validation.numericValue < 0) {
      setError('Amount cannot be negative');
      return;
    }

    onSave(validation.numericValue);
    setIsEditing(false);
    setError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const getChangeText = () => {
    if (!changePercentage) return null;
    
    const sign = changeDirection === 'up' ? '+' : '-';
    const colorClass = changeDirection === 'up' ? 'text-emerald-400' : 'text-red-400';
    
    return (
      <p className={`text-xs ${colorClass}`}>
        {sign}{Math.abs(changePercentage)}% from last month
      </p>
    );
  };

  return (
    <Card className="backdrop-blur-sm bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-300">{title}</CardTitle>
        <div className="flex items-center gap-2">
          {getIcon()}
          {!isEditing && !isLoading && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-6 w-6 p-0 text-gray-400 hover:text-white"
            >
              <Edit2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-3">
            <div className="space-y-2">
              <Input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Enter amount"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-emerald-400"
                autoFocus
              />
              {error && (
                <p className="text-xs text-red-400">{error}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleSave}
                className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1"
              >
                <Check className="h-3 w-3 mr-1" />
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                className="border-white/20 text-gray-300 hover:text-white hover:bg-white/10 flex-1"
              >
                <X className="h-3 w-3 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-2xl font-bold text-white">
              {isLoading ? 'Loading...' : formatCurrency(value)}
            </div>
            {getChangeText()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
