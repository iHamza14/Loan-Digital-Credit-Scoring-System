import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  FileText, 
  TrendingUp,
  X,
  Filter
} from 'lucide-react'

export default function Notifications() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'score_update',
      title: 'Credit Score Updated',
      message: 'Your credit score has been updated from 747 to 762. Great job!',
      time: '2 hours ago',
      read: false,
      important: true
    },
    {
      id: 2,
      type: 'document_request',
      title: 'Additional Documents Required',
      message: 'Please upload your recent electricity bill to complete income verification for your loan application.',
      time: '1 day ago',
      read: false,
      important: true
    },
    {
      id: 3,
      type: 'loan_approved',
      title: 'Loan Application Approved',
      message: 'Your loan application for ₹50,000 has been approved. Funds will be disbursed within 24 hours.',
      time: '3 days ago',
      read: true,
      important: true
    },
    {
      id: 4,
      type: 'system',
      title: 'System Maintenance',
      message: 'Scheduled maintenance this weekend. The platform may be unavailable for 2 hours on Sunday.',
      time: '1 week ago',
      read: true,
      important: false
    },
    {
      id: 5,
      type: 'payment_reminder',
      title: 'Payment Due Reminder',
      message: 'Friendly reminder: Your next loan installment of ₹5,250 is due in 3 days.',
      time: '1 week ago',
      read: true,
      important: false
    },
    {
      id: 6,
      type: 'feature_update',
      title: 'New Feature Available',
      message: 'Check out the new credit score improvement tips in your dashboard!',
      time: '2 weeks ago',
      read: true,
      important: false
    }
  ])

  const filters = [
    { id: 'all', label: 'All Notifications' },
    { id: 'unread', label: 'Unread' },
    { id: 'important', label: 'Important' },
    { id: 'loan', label: 'Loan Updates' },
    { id: 'system', label: 'System' }
  ]

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'score_update':
        return <TrendingUp className="w-5 h-5 text-green-500" />
      case 'loan_approved':
        return <CheckCircle className="w-5 h-5 text-blue-500" />
      case 'document_request':
        return <FileText className="w-5 h-5 text-yellow-500" />
      case 'payment_reminder':
        return <Clock className="w-5 h-5 text-orange-500" />
      case 'system':
        return <AlertCircle className="w-5 h-5 text-purple-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case 'score_update':
        return 'bg-green-50 border-green-200'
      case 'loan_approved':
        return 'bg-blue-50 border-blue-200'
      case 'document_request':
        return 'bg-yellow-50 border-yellow-200'
      case 'payment_reminder':
        return 'bg-orange-50 border-orange-200'
      case 'system':
        return 'bg-purple-50 border-purple-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'unread') return !notification.read
    if (activeFilter === 'important') return notification.important
    if (activeFilter === 'loan') return ['loan_approved', 'document_request', 'payment_reminder'].includes(notification.type)
    if (activeFilter === 'system') return notification.type === 'system'
    return true
  })

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-2">
              {unreadCount > 0 
                ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
                : 'All caught up!'
              }
            </p>
          </div>
          
          <div className="flex space-x-3">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center space-x-4 mb-6 overflow-x-auto pb-2"
        >
          <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === filter.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </motion.div>

        {/* Notifications List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <AnimatePresence>
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative border rounded-2xl p-4 transition-all ${
                    getNotificationColor(notification.type)
                  } ${!notification.read ? 'ring-2 ring-blue-200' : ''}`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className={`font-semibold ${
                            !notification.read ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </h3>
                          <p className="text-gray-600 mt-1 text-sm">
                            {notification.message}
                          </p>
                          <p className="text-gray-400 text-xs mt-2">
                            {notification.time}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              Mark read
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {notification.important && (
                        <div className="mt-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Important
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {!notification.read && (
                    <div className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                <p className="text-gray-500">
                  {activeFilter === 'all' 
                    ? "You're all caught up! Check back later for new updates."
                    : `No ${activeFilter} notifications found.`
                  }
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Notification Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Notification Preferences</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'Loan Application Updates', description: 'Get notified about your loan application status' },
              { label: 'Credit Score Changes', description: 'Receive alerts when your credit score updates' },
              { label: 'Payment Reminders', description: 'Reminders for upcoming loan payments' },
              { label: 'System Announcements', description: 'Important platform updates and maintenance' },
              { label: 'New Features', description: 'Updates about new platform features' },
              { label: 'Promotional Offers', description: 'Special offers and promotional content' }
            ].map((preference, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{preference.label}</div>
                  <div className="text-sm text-gray-500 mt-1">{preference.description}</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end mt-6">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Save Preferences
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}