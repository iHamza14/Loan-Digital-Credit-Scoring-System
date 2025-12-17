import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Target, AlertCircle, CheckCircle } from 'lucide-react'

export default function Score() {
  const scoreData = {
    currentScore: 762,
    maxScore: 900,
    riskBand: 'Low Risk - High Need',
    trend: 'up', // up, down, stable
    change: 15,
    history: [
      { month: 'Jan', score: 747 },
      { month: 'Feb', score: 752 },
      { month: 'Mar', score: 745 },
      { month: 'Apr', score: 758 },
      { month: 'May', score: 762 },
    ],
    factors: [
      { name: 'Repayment History', score: 95, impact: 'positive' },
      { name: 'Business Longevity', score: 88, impact: 'positive' },
      { name: 'Income Stability', score: 82, impact: 'neutral' },
      { name: 'Credit Utilization', score: 78, impact: 'neutral' },
      { name: 'Document Completeness', score: 65, impact: 'negative' },
    ],
    improvements: [
      'Upload recent utility bills to improve income verification',
      'Clear any pending small loans to boost repayment score',
      'Update business registration documents',
      'Maintain consistent mobile recharge patterns'
    ]
  }

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-5 h-5 text-green-500" />
      case 'down': return <TrendingDown className="w-5 h-5 text-red-500" />
      default: return <Target className="w-5 h-5 text-blue-500" />
    }
  }

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'positive': return 'text-green-600'
      case 'negative': return 'text-red-600'
      default: return 'text-yellow-600'
    }
  }

  const getImpactIcon = (impact) => {
    switch (impact) {
      case 'positive': return <TrendingUp className="w-4 h-4" />
      case 'negative': return <TrendingDown className="w-4 h-4" />
      default: return <Target className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Credit Score & Risk Analysis</h1>
          <p className="text-gray-600 mt-2">Understand your creditworthiness and ways to improve</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Score Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-200 p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Credit Score</h2>
              <div className="flex items-center space-x-2">
                {getTrendIcon(scoreData.trend)}
                <span className={`text-sm font-medium ${
                  scoreData.trend === 'up' ? 'text-green-600' : 
                  scoreData.trend === 'down' ? 'text-red-600' : 'text-blue-600'
                }`}>
                  {scoreData.change} points
                </span>
              </div>
            </div>

            <div className="text-center mb-8">
              <div className="relative inline-block">
                <div className="w-48 h-48 rounded-full border-8 border-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-blue-600">{scoreData.currentScore}</div>
                    <div className="text-gray-500 text-sm mt-2">out of {scoreData.maxScore}</div>
                  </div>
                </div>
                <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-blue-500 border-r-blue-400 transform rotate-45"></div>
              </div>
              
              <div className="mt-6">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {scoreData.riskBand}
                </span>
              </div>
            </div>

            {/* Score Factors */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Factors</h3>
              <div className="space-y-4">
                {scoreData.factors.map((factor, index) => (
                  <div key={factor.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getImpactColor(factor.impact)} bg-opacity-10`}>
                        {getImpactIcon(factor.impact)}
                      </div>
                      <span className="font-medium text-gray-900">{factor.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${factor.score}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700 w-8">{factor.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Improvement Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Improvement Tips</h3>
              <div className="space-y-3">
                {scoreData.improvements.map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Target className="w-5 h-5 text-blue-600 mt-0.5" />
                    <p className="text-sm text-gray-800">{tip}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Risk Band Explanation */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Bands</h3>
              <div className="space-y-3">
                {[
                  { band: 'Low Risk - High Need', color: 'green', desc: 'Instant approval eligible' },
                  { band: 'Medium Risk - High Need', color: 'yellow', desc: 'Enhanced review required' },
                  { band: 'High Risk - High Need', color: 'red', desc: 'Financial guidance recommended' },
                  { band: 'Low Risk - Low Need', color: 'blue', desc: 'Standard processing' }
                ].map((risk) => (
                  <div key={risk.band} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                    <div className={`w-3 h-3 rounded-full bg-${risk.color}-500`}></div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{risk.band}</div>
                      <div className="text-xs text-gray-500">{risk.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Historical Trend */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Score History</h3>
              <div className="space-y-2">
                {scoreData.history.map((point, index) => (
                  <div key={point.month} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-sm text-gray-600">{point.month}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">{point.score}</span>
                      {index > 0 && (
                        <span className={`text-xs ${
                          point.score > scoreData.history[index - 1].score ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {point.score > scoreData.history[index - 1].score ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}