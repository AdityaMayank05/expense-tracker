// components/budget/CategoryBudgetEditor.tsx
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, Percent, DollarSign } from 'lucide-react'
import { BudgetCategory } from '../../types/budget'
import { categoryIcons } from '../../constants/budgetConstants'

interface CategoryBudgetEditorProps {
  categories: BudgetCategory[]
  totalIncome: number
  onCategoriesChange: (categories: BudgetCategory[]) => void
}

const CategoryBudgetEditor: React.FC<CategoryBudgetEditorProps> = ({
  categories,
  totalIncome,
  onCategoriesChange
}) => {
  const [viewMode, setViewMode] = React.useState<'percentage' | 'amount'>('percentage')

  const updateCategory = (id: string, updates: Partial<BudgetCategory>) => {
    const updatedCategories = categories.map(cat =>
      cat.id === id ? { ...cat, ...updates } : cat
    )
    onCategoriesChange(updatedCategories)
  }

  const removeCategory = (id: string) => {
    onCategoriesChange(categories.filter(cat => cat.id !== id))
  }

  const addCategory = (type: 'needs' | 'wants' | 'savings' | 'debt') => {
    const newCategory: BudgetCategory = {
      id: Date.now().toString(),
      name: 'New Category',
      icon: 'Other',
      amount: 0,
      allocated: 0,
      spent: 0,
      color: '#6B7280',
      type,
      rolloverEnabled: false
    }
    onCategoriesChange([...categories, newCategory])
  }

  const getTotalAllocated = () => {
    return categories.reduce((sum, cat) => sum + cat.allocated, 0)
  }

  const getRemainingIncome = () => {
    return totalIncome - getTotalAllocated()
  }

  const getPercentageAllocated = (amount: number) => {
    return totalIncome > 0 ? (amount / totalIncome) * 100 : 0
  }

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

  const groupedCategories = categories.reduce((acc, category) => {
    if (!acc[category.type]) acc[category.type] = []
    acc[category.type].push(category)
    return acc
  }, {} as Record<string, BudgetCategory[]>)

  const typeColors = {
    needs: 'bg-red-100 text-red-800',
    wants: 'bg-blue-100 text-blue-800',
    savings: 'bg-green-100 text-green-800',
    debt: 'bg-orange-100 text-orange-800'
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Budget Categories</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'percentage' ? 'amount' : 'percentage')}
              >
                {viewMode === 'percentage' ? <Percent className="h-4 w-4" /> : <DollarSign className="h-4 w-4" />}
                {viewMode === 'percentage' ? 'Percentage' : 'Amount'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Allocation Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(getTotalAllocated())}
              </div>
              <div className="text-sm text-muted-foreground">Total Allocated</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getRemainingIncome() >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {formatCurrency(getRemainingIncome())}
              </div>
              <div className="text-sm text-muted-foreground">Remaining</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                {getPercentageAllocated(getTotalAllocated()).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">of Income</div>
            </div>
          </div>

          {/* Category Groups */}
          {Object.entries(groupedCategories).map(([type, categoryList]) => (
            <div key={type} className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold capitalize">{type}</h3>
                  <Badge className={typeColors[type as keyof typeof typeColors]}>
                    {categoryList.length} categories
                  </Badge>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => addCategory(type as any)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>

              <div className="space-y-4">
                {categoryList.map((category) => (
                  <Card key={category.id} className="border-l-4" style={{ borderLeftColor: category.color }}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            {categoryIcons[category.icon] || categoryIcons['Other']}
                          </div>
                          <div>
                            <Input
                              value={category.name}
                              onChange={(e) => updateCategory(category.id, { name: e.target.value })}
                              className="font-medium border-none p-0 h-auto"
                            />
                            <div className="text-sm text-muted-foreground">
                              {getPercentageAllocated(category.allocated).toFixed(1)}% of total income
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeCategory(category.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {/* Amount Input */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>
                              {viewMode === 'percentage' ? 'Percentage' : 'Amount'}
                            </Label>
                            {viewMode === 'percentage' ? (
                              <div className="space-y-2">
                                <Slider
                                  value={[getPercentageAllocated(category.allocated)]}
                                  onValueChange={(value) => {
                                    const newAmount = (totalIncome * value[0]) / 100
                                    updateCategory(category.id, { allocated: newAmount })
                                  }}
                                  max={100}
                                  step={0.5}
                                  className="w-full"
                                />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>0%</span>
                                  <span>{getPercentageAllocated(category.allocated).toFixed(1)}%</span>
                                  <span>100%</span>
                                </div>
                              </div>
                            ) : (
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                <Input
                                  type="number"
                                  value={category.allocated}
                                  onChange={(e) => updateCategory(category.id, { allocated: parseFloat(e.target.value) || 0 })}
                                  className="pl-7"
                                />
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label>Rollover Settings</Label>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={category.rolloverEnabled}
                                onCheckedChange={(checked) => updateCategory(category.id, { rolloverEnabled: checked })}
                              />
                              <span className="text-sm">Enable rollover</span>
                            </div>
                          </div>
                        </div>

                        {/* Budget Summary */}
                        <div className="flex justify-between items-center text-sm bg-gray-50 p-3 rounded">
                          <span>Allocated: {formatCurrency(category.allocated)}</span>
                          <span>Spent: {formatCurrency(category.spent)}</span>
                          <span className={`font-semibold ${
                            category.allocated - category.spent >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            Remaining: {formatCurrency(category.allocated - category.spent)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export default CategoryBudgetEditor
