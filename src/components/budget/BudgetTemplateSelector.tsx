// components/budget/BudgetTemplateSelector.tsx
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles } from 'lucide-react'
import { BudgetTemplate } from '../../types/budget'
import { budgetTemplates } from '../../constants/budgetConstants'

interface BudgetTemplateSelectorProps {
  selectedTemplate: string | null
  onTemplateSelect: (template: BudgetTemplate) => void
  totalIncome: number
}

const BudgetTemplateSelector: React.FC<BudgetTemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateSelect,
  totalIncome
}) => {
  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5" />
          <span>Budget Templates</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose a proven budgeting method or start from scratch
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgetTemplates.map((template) => (
            <Card 
              key={template.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedTemplate === template.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => onTemplateSelect(template)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{template.name}</CardTitle>
                <p className="text-xs text-muted-foreground">{template.description}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Needs:</span>
                    <div className="text-right">
                      <div className="font-semibold">{template.categories.needs}%</div>
                      <div className="text-xs text-muted-foreground">
                        {formatCurrency((totalIncome * template.categories.needs) / 100)}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Wants:</span>
                    <div className="text-right">
                      <div className="font-semibold">{template.categories.wants}%</div>
                      <div className="text-xs text-muted-foreground">
                        {formatCurrency((totalIncome * template.categories.wants) / 100)}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Savings:</span>
                    <div className="text-right">
                      <div className="font-semibold">{template.categories.savings}%</div>
                      <div className="text-xs text-muted-foreground">
                        {formatCurrency((totalIncome * template.categories.savings) / 100)}
                      </div>
                    </div>
                  </div>
                  {template.categories.debt && (
                    <div className="flex justify-between text-sm">
                      <span>Debt:</span>
                      <div className="text-right">
                        <div className="font-semibold">{template.categories.debt}%</div>
                        <div className="text-xs text-muted-foreground">
                          {formatCurrency((totalIncome * template.categories.debt) / 100)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <Button 
                  size="sm" 
                  className="w-full mt-3"
                  variant={selectedTemplate === template.id ? "default" : "outline"}
                >
                  {selectedTemplate === template.id ? 'Selected' : 'Select Template'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default BudgetTemplateSelector
