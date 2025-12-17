import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Upload, 
  Bell,
  FileText,
  IndianRupee,
  MapPin,
  Users,
  Target
} from 'lucide-react'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const dashboardRef = useRef()

  // Mock data with enhanced analytics
  const userData = {
    creditScore: 762,
    riskBand: 'Low Risk - High Need',
    locationInsights: [
      { location: 'Your Area (Mumbai)', avgExpense: 85000, yourExpense: 78000, comparison: '8% below average' },
      { location: 'Similar Businesses', avgExpense: 92000, yourExpense: 78000, comparison: '15% below average' },
      { location: 'Industry Average', avgExpense: 75000, yourExpense: 78000, comparison: '4% above average' }
    ],
    loans: [
      { id: 1, amount: 50000, purpose: 'Business Expansion', status: 'approved', date: '2024-01-15' },
      { id: 2, amount: 25000, purpose: 'Working Capital', status: 'pending', date: '2024-01-20' },
      { id: 3, amount: 75000, purpose: 'Equipment Purchase', status: 'disbursed', date: '2023-12-10' }
    ],
    notifications: [
      { id: 1, type: 'score_update', message: 'Your credit score has been updated to 762', time: '2 hours ago' },
      { id: 2, type: 'document_request', message: 'Additional documents required for loan application', time: '1 day ago' },
      { id: 3, type: 'loan_approved', message: 'Your loan application has been approved', time: '3 days ago' }
    ]
  }

  useEffect(() => {
    gsap.fromTo('.dashboard-card', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }
    )
  }, [])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />
      case 'disbursed': return <TrendingUp className="w-5 h-5 text-blue-500" />
      default: return <AlertCircle className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'disbursed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's your financial overview</p>
        </motion.div>

        <div ref={dashboardRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Summary Cards */}
          <div className="lg:col-span-2 space-y-6">
            {/* Credit Score & Risk Analysis Card */}
            <motion.div
              className="dashboard-card bg-white rounded-2xl shadow-lg border border-gray-200 p-6 transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Credit & Risk Analysis</h2>
                <Link 
                  to="/dashboard/score" 
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                >
                  View Details
                </Link>
              </div>
              
              <div className="flex flex-col items-center text-center">
                {/* Credit Score Section */}
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 rounded-full border-8 border-blue-100 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">{userData.creditScore}</div>
                      <div className="text-gray-500 text-sm mt-1">out of 900</div>
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-blue-500 border-r-blue-400 transform rotate-45"></div>
                </div>
                
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {userData.riskBand}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm max-w-md">
                  Your credit score is in the excellent range. Maintain your current financial habits to keep your score high.
                </p>
              </div>
            </motion.div>

            {/* Location-based Insights */}
            <motion.div
              className="dashboard-card bg-white rounded-2xl shadow-lg border border-gray-200 p-6 transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                Location-based Insights
              </h2>
              
              <div className="space-y-6">
                {userData.locationInsights.map((insight, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{insight.location}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Avg: ₹{insight.avgExpense.toLocaleString()} | 
                        Your: ₹{insight.yourExpense.toLocaleString()}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      insight.comparison.includes('below') 
                        ? 'bg-green-100 text-green-800'
                        : insight.comparison.includes('above')
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {insight.comparison}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-sm text-gray-600">
                <p>💡 <strong>Insight:</strong> Your expenses are well-managed compared to similar businesses in your area.</p>
              </div>
            </motion.div>

            {/* Loan Status Table */}
            <motion.div className="dashboard-card bg-white rounded-2xl shadow-lg border border-gray-200 p-6 transition-colors duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Loan Applications</h2>
                <Link 
                  to="/apply-loan" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  New Application
                </Link>
              </div>

              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Loan Details
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {userData.loans.map((loan) => (
                      <tr key={loan.id} className="hover:bg-gray-50 transition-colors duration-300">
                        <td className="px-4 py-4">
                          <div className="text-sm font-medium text-gray-900">{loan.purpose}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center text-sm text-gray-900">
                            <IndianRupee className="w-4 h-4 mr-1" />
                            {loan.amount.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            {getStatusIcon(loan.status)}
                            <span className={`ml-2 text-sm font-medium ${getStatusColor(loan.status)} px-2 py-1 rounded-full`}>
                              {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          {new Date(loan.date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <motion.div
              className="dashboard-card bg-white rounded-2xl shadow-lg border border-gray-200 p-6 transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Active Loans</p>
                    <p className="text-xl font-bold text-gray-900">2</p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Total Borrowed</p>
                    <p className="text-xl font-bold text-gray-900">₹1.25L</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Credit Utilization</p>
                    <p className="text-xl font-bold text-gray-900">35%</p>
                  </div>
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </motion.div>

            {/* Upload Documents Card */}
            <motion.div
              className="dashboard-card bg-white rounded-2xl shadow-lg border border-gray-200 p-6 transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Your Information</h3>
              <p className="text-gray-600 text-sm mb-4">
                Keep your profile updated to maintain accurate credit scoring
              </p>
              
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-sm font-medium text-gray-700">Upload Utility Bills</span>
                  </div>
                  <Upload className="w-4 h-4 text-gray-400" />
                </button>
                
                <button className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-sm font-medium text-gray-700">Add Income Documents</span>
                  </div>
                  <Upload className="w-4 h-4 text-gray-400" />
                </button>
                
                <button className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-sm font-medium text-gray-700">Update Business Info</span>
                  </div>
                  <Upload className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </motion.div>

            {/* Notifications Card */}
            <motion.div
              className="dashboard-card bg-white rounded-2xl shadow-lg border border-gray-200 p-6 transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <Bell className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="space-y-4">
                {userData.notifications.map((notification) => (
                  <div key={notification.id} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Link 
                to="/notifications" 
                className="block text-center mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                View All Notifications
              </Link>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              className="dashboard-card bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <Link 
                  to="/apply-loan" 
                  className="block w-full text-center bg-white text-blue-600 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Apply for New Loan
                </Link>
                
                <Link 
                  to="/dashboard/score" 
                  className="block w-full text-center border border-white text-white py-3 rounded-lg font-medium hover:bg-white hover:bg-opacity-10 transition-colors"
                >
                  Check Credit Score
                </Link>
                
                <Link 
                  to="/help" 
                  className="block w-full text-center border border-white text-white py-3 rounded-lg font-medium hover:bg-white hover:bg-opacity-10 transition-colors"
                >
                  Get Support
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}