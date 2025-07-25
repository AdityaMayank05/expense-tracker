// components/budget/RolloverSettings.tsx
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { RotateCcw, TrendingUp, AlertCircle } from 'lucide-react'
import { BudgetSettings, BudgetCategory } from '../../types/budget'

interface RolloverSettingsProps {
  settings: BudgetSettings
  categories: BudgetCategory[]
  onSettingsChange: (settings: BudgetSettings) => void
}

const RolloverSettings: React.FC<RolloverSettingsProps> = ({
  settings,
  categories,
  onSettingsChange
}) => {
  const rolloverEnabledCategories = categories.filter(cat => cat.rolloverEnabled)
  
  const handleRolloverPolicyChange = (policy: string) => {
    onSettingsChange({
      ...settings,
      rolloverPolicy: policy as any
    })
  }

  const handleRolloverPercentageChange = (percentage: string) => {
    onSettingsChange({
      ...settings,
      rolloverPercentage: parseFloat(percentage) || 0
    })
  }

  const handleAutoAdjustChange = (enabled: boolean) => {
    onSettingsChange({
      ...settings,
      autoAdjust: enabled
    })
  }

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

  const getPotentialRollover = () => {
    return rolloverEnabledCategories.reduce((sum, cat) => {
      const remaining = cat.allocated - cat.spent
      return sum + (remaining > 0 ? remaining : 0)
    }, 0)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <RotateCcw className="h-5 w-5" />
          <span>Rollover Settings</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Configure how unused budget amounts are handled at the end of each period
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rollover Policy */}
        <div className="space-y-3">
          <Label>Rollover Policy</Label>
          <Select value={settings.rolloverPolicy} onValueChange={handleRolloverPolicyChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select rollover policy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="carry-over">Carry Over All</SelectItem>
              <SelectItem value="reset">Reset to Zero</SelectItem>
              <SelectItem value="percentage">Carry Over Percentage</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="text-xs text-muted-foreground">
            {settings.rolloverPolicy === 'carry-over' && 
              'All unused amounts will be added to the next period\'s budget'}
            {settings.rolloverPolicy === 'reset' && 
              'All unused amounts will be lost at the end of the period'}
            {settings.rolloverPolicy === 'percentage' && 
              'A percentage of unused amounts will be carried over'}
          </div>
        </div>

        {/* Percentage Setting */}
        {settings.rolloverPolicy === 'percentage' && (
          <div className="space-y-2">
            <Label>Rollover Percentage</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                min="0"
                max="100"
                value={settings.rolloverPercentage || 50}
                onChange={(e) => handleRolloverPercentageChange(e.target.value)}
                className="w-20"
              />
              <span className="text-sm text-muted-foreground">% of unused budget</span>
            </div>
          </div>
        )}

        {/* Auto-Adjust Setting */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <Label>Auto-Adjust Budget</Label>
              <p className="text-xs text-muted-foreground">
                Automatically adjust next period's budget based on spending patterns
              </p>
            </div>
            <Switch
              checked={settings.autoAdjust}
              onCheckedChange={handleAutoAdjustChange}
            />
          </div>
        </div>

        {/* Rollover Summary */}
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span className="font-medium">Rollover Summary</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-800 font-medium">Categories with Rollover</div>
              <div className="text-2xl font-bold text-blue-600">
                {rolloverEnabledCategories.length}
              </div>
              <div className="text-xs text-blue-600">
                out of {categories.length} total categories
              </div>
            </div>
            
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-sm text-green-800 font-medium">Potential Rollover</div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(getPotentialRollover())}
              </div>
              <div className="text-xs text-green-600">
                based on current spending
              </div>
            </div>
          </div>
        </div>

        {/* Rollover-Enabled Categories */}
        {rolloverEnabledCategories.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Categories with Rollover Enabled</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {rolloverEnabledCategories.map((category) => (
                <Badge key={category.id} variant="secondary" className="text-xs">
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default RolloverSettings
