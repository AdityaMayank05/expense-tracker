// components/analytics/InsightsPanel.tsx
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Lightbulb, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Target,
  PiggyBank,
  CreditCard,
  ExternalLink,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react'
import { SpendingAnomaly, AnalyticsInsight } from '../../types/analytics'

interface InsightsPanelProps {
  anomalies: SpendingAnomaly[]
  insights: AnalyticsInsight[]
  loading?: boolean
}

const InsightsPanel: React.FC<InsightsPanelProps> = ({ anomalies, insights, loading }) => {
  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

  const getAnomalyIcon = (type: SpendingAnomaly['type']) => {
    switch (type) {
      case 'unusual_amount': return <AlertTriangle className="h-4 w-4" />
      case 'budget_overrun': return <Target className="h-4 w-4" />
      case 'category_spike': return <TrendingUp className="h-4 w-4" />
      case 'merchant_frequency': return <CreditCard className="h-4 w-4" />
      default: return <Info className="h-4 w-4" />
    }
  }

  const getAnomalySeverityColor = (severity: SpendingAnomaly['severity']) => {
    switch (severity) {
      case 'high': return 'border-red-200 bg-red-50 text-red-800'
      case 'medium': return 'border-yellow-200 bg-yellow-50 text-yellow-800'
      case 'low': return 'border-primary/20 bg-primary/10 text-primary'
      default: return 'border-gray-200 bg-gray-50 text-gray-800'
    }
  }

  const getInsightIcon = (type: AnalyticsInsight['type']) => {
    switch (type) {
      case 'trend': return <TrendingUp className="h-4 w-4" />
      case 'budget': return <Target className="h-4 w-4" />
      case 'category': return <CreditCard className="h-4 w-4" />
      case 'savings_opportunity': return <PiggyBank className="h-4 w-4" />
      default: return <Lightbulb className="h-4 w-4" />
    }
  }

  const getInsightColor = (impact: AnalyticsInsight['impact']) => {
    switch (impact) {
      case 'positive': return 'text-green-600'
      case 'negative': return 'text-red-600'
      default: return 'text-primary'
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-20 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-16 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Anomalies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <span>Spending Anomalies</span>
            {anomalies.length > 0 && (
              <Badge variant="destructive">{anomalies.length}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {anomalies.length === 0 ? (
            <div className="text-center py-6">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">All Good!</h3>
              <p className="text-gray-600 text-sm">No unusual spending patterns detected.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {anomalies.map((anomaly) => (
                <div 
                  key={anomaly.id}
                  className={`p-4 rounded-lg border ${getAnomalySeverityColor(anomaly.severity)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getAnomalyIcon(anomaly.type)}
                      <span className="font-medium">{anomaly.title}</span>
                    </div>
                    <Badge 
                      variant={anomaly.severity === 'high' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {anomaly.severity}
                    </Badge>
                  </div>
                  
                  <p className="text-sm mb-2">{anomaly.description}</p>
                  
                  {anomaly.amount && (
                    <div className="text-sm font-semibold mb-2">
                      Amount: {formatCurrency(anomaly.amount)}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-xs">
                    <span>{new Date(anomaly.date).toLocaleDateString()}</span>
                    {anomaly.category && (
                      <Badge variant="outline" className="text-xs">
                        {anomaly.category}
                      </Badge>
                    )}
                  </div>
                  
                  {anomaly.suggestion && (
                    <div className="mt-3 p-2 bg-white/50 rounded text-xs">
                      <strong>Suggestion:</strong> {anomaly.suggestion}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <span>Smart Insights</span>
            {insights.length > 0 && (
              <Badge variant="secondary">{insights.length}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {insights.length === 0 ? (
            <div className="text-center py-6">
              <Info className="h-12 w-12 text-primary mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">Stay Tuned</h3>
              <p className="text-gray-600 text-sm">More spending insights coming soon as we analyze your patterns.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {insights.map((insight) => (
                <div 
                  key={insight.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className={`flex items-center space-x-2 ${getInsightColor(insight.impact)}`}>
                      {getInsightIcon(insight.type)}
                      <span className="font-medium">{insight.title}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {insight.impact === 'positive' && <TrendingUp className="h-3 w-3 text-green-500" />}
                      {insight.impact === 'negative' && <TrendingDown className="h-3 w-3 text-red-500" />}
                      {insight.actionRequired && (
                        <Badge variant="outline" className="text-xs">
                          Action Required
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-3">{insight.description}</p>
                  
                  {insight.suggestion && (
                    <div className="bg-primary/10 border border-primary/20 rounded p-3 mb-3">
                      <div className="flex items-start space-x-2">
                        <Lightbulb className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-primary/80 mb-1">Recommendation</div>
                          <div className="text-sm text-primary/70">{insight.suggestion}</div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {insight.actionRequired && (
                    <Button size="sm" variant="outline" className="w-full">
                      Take Action
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default InsightsPanel
