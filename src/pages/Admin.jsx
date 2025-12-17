import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Users,
  IndianRupee,
  PieChart,
  MapPin
} from 'lucide-react'

// Mock data for charts
const riskBandData = [
  { name: 'Low Risk', value: 45, color: '#10b981' },
  { name: 'Medium Risk', value: 30, color: '#f59e0b' },
  { name: 'High Risk', value: 15, color: '#ef4444' },
  { name: 'Under Review', value: 10, color: '#6b7280' }
]

const locationExpenseData = [
  { location: 'Metro Cities', avgExpense: 85000, loanCount: 89 },
  { location: 'Tier 2 Cities', avgExpense: 45000, loanCount: 67 },
  { location: 'Tier 3 Cities', avgExpense: 28000, loanCount: 45 },
  { location: 'Rural Areas', avgExpense: 15000, loanCount: 32 }
]

export default function Admin() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedApplication, setSelectedApplication] = useState(null)

  // Mock data
  const adminData = {
    overview: {
      totalApplications: 156,
      approved: 89,
      pending: 42,
      rejected: 25,
      totalDisbursed: 4520000
    },
    applications: [
      {
        id: 'APP001',
        name: 'Rajesh Kumar',
        amount: 50000,
        score: 762,
        riskBand: 'Low Risk - High Need',
        status: 'auto_approved',
        date: '2024-01-20',
        business: 'Retail Store',
        location: 'Mumbai, MH'
      },
      {
        id: 'APP002',
        name: 'Priya Sharma',
        amount: 75000,
        score: 645,
        riskBand: 'Medium Risk - High Need',
        status: 'manual_review',
        date: '2024-01-19',
        business: 'Beauty Salon',
        location: 'Delhi, DL'
      },
      {
        id: 'APP003',
        name: 'Amit Patel',
        amount: 30000,
        score: 580,
        riskBand: 'High Risk - High Need',
        status: 'referred',
        date: '2024-01-18',
        business: 'Auto Repair',
        location: 'Ahmedabad, GJ'
      }
    ]
  }

  const getStatusInfo = (status) => {
    switch (status) {
      case 'auto_approved':
        return { icon: CheckCircle, color: 'text-green-500', bgColor: 'bg-green-100', label: 'Auto Approved' }
      case 'manual_review':
        return { icon: Clock, color: 'text-yellow-500', bgColor: 'bg-yellow-100', label: 'Manual Review' }
      case 'referred':
        return { icon: AlertCircle, color: 'text-red-500', bgColor: 'bg-red-100', label: 'Referred' }
      default:
        return { icon: Clock, color: 'text-gray-500', bgColor: 'bg-gray-100', label: 'Pending' }
    }
  }

  // Simple Pie Chart Component
  const RiskPieChart = () => (
    <div className="relative w-full h-48">
      <div className="absolute inset-0 flex items-center justify-center">
        <PieChart className="w-16 h-16 text-gray-400" />
      </div>
      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
        {riskBandData.reduce((acc, segment, index) => {
          const previousValue = acc;
          const circumference = 2 * Math.PI * 40;
          const strokeDasharray = `${(segment.value / 100) * circumference} ${circumference}`;
          const strokeDashoffset = circumference - (previousValue / 100) * circumference;
          
          acc += segment.value;
          
          return [
            ...acc,
            <circle
              key={index}
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={segment.color}
              strokeWidth="20"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-500"
            />
          ];
        }, [])}
      </svg>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage loan applications and monitor platform performance</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Applications', value: adminData.overview.totalApplications, icon: Users, color: 'blue' },
            { label: 'Approved', value: adminData.overview.approved, icon: CheckCircle, color: 'green' },
            { label: 'Pending Review', value: adminData.overview.pending, icon: Clock, color: 'yellow' },
            { label: 'Total Disbursed', value: `₹${(adminData.overview.totalDisbursed / 100000).toFixed(1)}L`, icon: TrendingUp, color: 'purple' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 transition-colors duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Analytics Section */}
          <div className="lg:col-span-1 space-y-6">
            {/* Risk Band Distribution */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 transition-colors duration-300"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <PieChart className="w-5 h-5 mr-2" />
                Risk Band Distribution
              </h3>
              
              <RiskPieChart />
              
              <div className="space-y-2 mt-4">
                {riskBandData.map((band, index) => (
                  <div key={band.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: band.color }}
                      ></div>
                      <span className="text-gray-700">{band.name}</span>
                    </div>
                    <span className="font-medium text-gray-900">{band.value}%</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Location-wise Expenses */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 transition-colors duration-300"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Location-wise Analysis
              </h3>
              
              <div className="space-y-4">
                {locationExpenseData.map((location, index) => (
                  <div key={location.location} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">
                        {location.location}
                      </span>
                      <span className="text-sm text-gray-600">
                        {location.loanCount} loans
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(location.avgExpense / 100000) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Avg. Loan: ₹{location.avgExpense.toLocaleString()}</span>
                      <span>{(location.avgExpense / 100000 * 100).toFixed(0)}% of max</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Applications Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-colors duration-300"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Loan Applications</h2>
                  <div className="flex space-x-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search applications..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
                      />
                    </div>
                    <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-300">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applicant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Risk Band
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {adminData.applications.map((app) => {
                      const statusInfo = getStatusInfo(app.status)
                      const StatusIcon = statusInfo.icon
                      
                      return (
                        <tr key={app.id} className="hover:bg-gray-50 transition-colors duration-300">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{app.name}</div>
                              <div className="text-sm text-gray-500">{app.business}</div>
                              <div className="text-xs text-gray-400">{app.location}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center text-sm text-gray-900">
                              <IndianRupee className="w-4 h-4 mr-1" />
                              {app.amount.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{app.score}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {app.riskBand}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <StatusIcon className={`w-4 h-4 mr-2 ${statusInfo.color}`} />
                              <span className={`text-sm font-medium ${statusInfo.color}`}>
                                {statusInfo.label}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => setSelectedApplication(app)}
                              className="text-blue-600 hover:text-blue-900 text-sm font-medium transition-colors duration-300"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Queues Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Auto-Approval Queue */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 transition-colors duration-300"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Auto-Approval Queue</h3>
                <div className="space-y-3">
                  {adminData.applications
                    .filter(app => app.status === 'auto_approved')
                    .map(app => (
                      <div key={app.id} className="p-3 border border-green-200 rounded-lg bg-green-50 transition-colors duration-300">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-green-900">{app.name}</span>
                          <span className="text-green-600 font-bold">{app.score}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-green-700">₹{app.amount.toLocaleString()}</span>
                          <button className="text-green-600 hover:text-green-800 text-sm font-medium transition-colors duration-300">
                            Disburse
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </motion.div>

              {/* Manual Review Queue */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 transition-colors duration-300"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Manual Review Queue</h3>
                <div className="space-y-3">
                  {adminData.applications
                    .filter(app => app.status === 'manual_review')
                    .map(app => (
                      <div key={app.id} className="p-3 border border-yellow-200 rounded-lg bg-yellow-50 transition-colors duration-300">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-yellow-900">{app.name}</span>
                          <span className="text-yellow-600 font-bold">{app.score}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-yellow-700">₹{app.amount.toLocaleString()}</span>
                          <button className="text-yellow-600 hover:text-yellow-800 text-sm font-medium transition-colors duration-300">
                            Review
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}