// pages/BudgetCreationPage.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Save, Eye, ArrowLeft } from 'lucide-react'
import BudgetTemplateSelector from '@/components/budget/BudgetTemplateSelector'
import BudgetPeriodSelector from '@/components/budget/BudgetPeriodSelector'
import CategoryBudgetEditor from '@/components/budget/CategoryBudgetEditor'
import IncomeAllocationChart from '@/components/budget/IncomeAllocationChart'
import RolloverSettings from '@/components/budget/RolloverSettings'
import { Budget, BudgetCategory, BudgetSettings, BudgetTemplate } from '@/types/budget'
import { defaultCategories } from '@/constants/budgetConstants'

export default function BudgetCreationPage() {
  const [budgetName, setBudgetName] = useState('My Budget')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [settings, setSettings] = useState<BudgetSettings>({
    totalIncome: 5000,
    period: {
      type: 'monthly',
      startDate: new Date(),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())
    },
    rolloverPolicy: 'carry-over',
    rolloverPercentage: 50,
    autoAdjust: false
  })
  const [categories, setCategories] = useState<BudgetCategory[]>([])
  const [activeTab, setActiveTab] = useState('setup')

  // Initialize default categories
  useEffect(() => {
    const initialCategories: BudgetCategory[] = defaultCategories.map((cat, index) => ({
      id: (index + 1).toString(),
      name: cat.name,
      icon: cat.name,
      amount: 0,
      allocated: 0,
      spent: Math.random() * 200, // Mock spent data
      color: cat.color,
      type: cat.type as any,
      rolloverEnabled: cat.type === 'savings'
    }))
    setCategories(initialCategories)
  }, [])

  const handleTemplateSelect = (template: BudgetTemplate) => {
    setSelectedTemplate(template.id)
    
    // Apply template percentages to categories
    const updatedCategories = categories.map(category => {
      let percentage = 0
      switch (category.type) {
        case 'needs':
          percentage = template.categories.needs
          break
        case 'wants':
          percentage = template.categories.wants
          break
        case 'savings':
          percentage = template.categories.savings
          break
        case 'debt':
          percentage = template.categories.debt || 0
          break
      }
      
      // Distribute percentage evenly among categories of the same type
      const categoriesOfSameType = categories.filter(c => c.type === category.type)
      const amountPerCategory = (settings.totalIncome * percentage / 100) / categoriesOfSameType.length
      
      return {
        ...category,
        allocated: amountPerCategory
      }
    })
    
    setCategories(updatedCategories)
  }

  const handleSaveBudget = () => {
    const budget: Budget = {
      id: Date.now().toString(),
      name: budgetName,
      settings,
      categories,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    }
    
    console.log('Saving budget:', budget)
    // Here you would typically save to your backend
    alert('Budget saved successfully!')
  }

  const getTotalAllocated = () => {
    return categories.reduce((sum, cat) => sum + cat.allocated, 0)
  }

  const getRemainingIncome = () => {
    return settings.totalIncome - getTotalAllocated()
  }

  const getAllocationPercentage = () => {
    return settings.totalIncome > 0 ? (getTotalAllocated() / settings.totalIncome) * 100 : 0
  }

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

  const isValidBudget = () => {
    return (
      budgetName.trim() !== '' &&
      settings.totalIncome > 0 &&
      categories.length > 0 &&
      Math.abs(getRemainingIncome()) < 1 // Allow for small rounding differences
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Budgets
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create Budget</h1>
              <p className="text-gray-600">Set up your personalized budget plan</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button 
              onClick={handleSaveBudget}
              disabled={!isValidBudget()}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Budget
            </Button>
          </div>
        </div>

        {/* Budget Name */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="budget-name">Budget Name</Label>
                <Input
                  id="budget-name"
                  value={budgetName}
                  onChange={(e) => setBudgetName(e.target.value)}
                  placeholder="Enter budget name"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Total Income</Label>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(settings.totalIncome)}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Allocation Status</Label>
                <div className="flex items-center space-x-2">
                  <Badge variant={getRemainingIncome() === 0 ? "default" : getRemainingIncome() > 0 ? "secondary" : "destructive"}>
                    {getRemainingIncome() === 0 ? 'Fully Allocated' : 
                     getRemainingIncome() > 0 ? 'Under Allocated' : 'Over Allocated'}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {getAllocationPercentage().toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="allocation">Allocation</TabsTrigger>
            <TabsTrigger value="rollover">Rollover</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="space-y-6">
            <BudgetTemplateSelector
              selectedTemplate={selectedTemplate}
              onTemplateSelect={handleTemplateSelect}
              totalIncome={settings.totalIncome}
            />
            <BudgetPeriodSelector
              settings={settings}
              onSettingsChange={setSettings}
            />
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <CategoryBudgetEditor
              categories={categories}
              totalIncome={settings.totalIncome}
              onCategoriesChange={setCategories}
            />
          </TabsContent>

          <TabsContent value="allocation" className="space-y-6">
            <IncomeAllocationChart
              categories={categories}
              totalIncome={settings.totalIncome}
            />
          </TabsContent>

          <TabsContent value="rollover" className="space-y-6">
            <RolloverSettings
              settings={settings}
              categories={categories}
              onSettingsChange={setSettings}
            />
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Budget Preview</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Review your budget configuration before saving
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Budget Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">{budgetName}</div>
                      <div className="text-sm text-gray-600">Budget Name</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">{formatCurrency(settings.totalIncome)}</div>
                      <div className="text-sm text-gray-600">Total Income</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-primary">{formatCurrency(getTotalAllocated())}</div>
                      <div className="text-sm text-gray-600">Total Allocated</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-semibold ${getRemainingIncome() >= 0 ? 'text-gray-600' : 'text-red-600'}`}>
                        {formatCurrency(getRemainingIncome())}
                      </div>
                      <div className="text-sm text-gray-600">Remaining</div>
                    </div>
                  </div>

                  {/* Categories Summary */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Categories ({categories.length})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {categories.map((category) => (
                        <div key={category.id} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                            <span className="font-medium">{category.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {category.type}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{formatCurrency(category.allocated)}</div>
                            <div className="text-xs text-gray-500">
                              {((category.allocated / settings.totalIncome) * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Settings Summary */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-3 bg-white border rounded-lg">
                        <div className="font-medium">Period</div>
                        <div className="text-sm text-gray-600 capitalize">{settings.period.type}</div>
                      </div>
                      <div className="p-3 bg-white border rounded-lg">
                        <div className="font-medium">Rollover Policy</div>
                        <div className="text-sm text-gray-600 capitalize">{settings.rolloverPolicy.replace('-', ' ')}</div>
                      </div>
                      <div className="p-3 bg-white border rounded-lg">
                        <div className="font-medium">Auto-Adjust</div>
                        <div className="text-sm text-gray-600">{settings.autoAdjust ? 'Enabled' : 'Disabled'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              const tabs = ['setup', 'categories', 'allocation', 'rollover', 'preview']
              const currentIndex = tabs.indexOf(activeTab)
              if (currentIndex > 0) {
                setActiveTab(tabs[currentIndex - 1])
              }
            }}
            disabled={activeTab === 'setup'}
          >
            Previous
          </Button>
          
          <Button
            onClick={() => {
              const tabs = ['setup', 'categories', 'allocation', 'rollover', 'preview']
              const currentIndex = tabs.indexOf(activeTab)
              if (currentIndex < tabs.length - 1) {
                setActiveTab(tabs[currentIndex + 1])
              } else {
                handleSaveBudget()
              }
            }}
          >
            {activeTab === 'preview' ? 'Save Budget' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  )
}
