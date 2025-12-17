import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, User, LogOut, Bell } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { gsap } from 'gsap'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()

  const notifications = [
    { id: 1, message: 'Your loan application was approved', time: '2h ago', read: false },
    { id: 2, message: 'Credit score updated to 762', time: '1d ago', read: false },
    { id: 3, message: 'Document verification required', time: '2d ago', read: true }
  ]

  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    gsap.fromTo('.nav-item', { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 })
  }, [])

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 transition-colors duration-300">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
{/* Logo */}
{/* Logo */}
<Link to="/" className="flex items-center space-x-2 nav-item">
  <svg width="32" height="32" viewBox="0 0 32 32" className="w-8 h-8">
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2563eb" />
        <stop offset="100%" stopColor="#7c3aed" />
      </linearGradient>
    </defs>
    {/* Shield shape for trust and security */}
    <path d="M16 2 L28 8 V16 C28 22 24 28 16 30 C8 28 4 22 4 16 V8 Z" fill="url(#logoGradient)" opacity="0.9"/>
    {/* Proper Indian Rupee symbol */}
    <text x="16" y="20" textAnchor="middle" fill="white" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold">₹</text>
  </svg>
  <span className="text-xl font-bold text-gray-900">LoanSewa</span>
</Link>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`nav-item ${location.pathname === '/' ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'}`}
            >
              Home
            </Link>
            {user && user.role !== 'admin' && (
              <Link 
                to="/apply-loan" 
                className={`nav-item ${location.pathname === '/apply-loan' ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'}`}
              >
                Apply
              </Link>
            )}
            {user && user.role !== 'admin' && (
              <Link 
                to="/dashboard" 
                className={`nav-item ${location.pathname === '/dashboard' ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'}`}
              >
                Dashboard
              </Link>
            )}
            {user && user.role !== 'admin' && (
              <Link 
                to="/credit-analytics" 
                className={`nav-item ${location.pathname === '/credit-analytics' ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'}`}
              >
                Credit Analytics
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link 
                to="/admin" 
                className={`nav-item ${location.pathname === '/admin' ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'}`}
              >
                Admin Dashboard
              </Link>
            )}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Notifications */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors relative"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map(n => (
                        <div
                          key={n.id}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${!n.read ? 'bg-blue-50' : ''}`}
                        >
                          <p className="text-sm text-gray-800">{n.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{n.time}</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 border-t border-gray-200">
                      <Link
                        to="/notifications"
                        onClick={() => setIsNotificationsOpen(false)}
                        className="block text-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View All Notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Auth */}
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">Welcome, {user.name}</span>
                <Link
                  to={user.role === "admin" ? "/admin" : "/dashboard"}
                  className="p-2 text-gray-600 hover:text-blue-600"
                >
                  <User size={20} />
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-gray-600 hover:text-red-600"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4 nav-item">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/" className="block px-3 py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>Home</Link>
              {user && user.role !== 'admin' && <Link to="/apply-loan" className="block px-3 py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>Apply</Link>}
              {user && user.role !== 'admin' && <Link to="/dashboard" className="block px-3 py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>Dashboard</Link>}
              {user && user.role !== 'admin' && <Link to="/credit-analytics" className="block px-3 py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>Credit Analytics</Link>}
              {user?.role === 'admin' && <Link to="/admin" className="block px-3 py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>Admin Dashboard</Link>}
              
              {user && <Link to="/notifications" className="block px-3 py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>Notifications</Link>}

              <div className="border-t pt-2">
                {user ? (
                  <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50">Logout</button>
                ) : (
                  <>
                    <Link to="/login" className="block px-3 py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>Login</Link>
                    <Link to="/signup" className="block px-3 py-2 text-blue-600 hover:bg-blue-50" onClick={() => setIsOpen(false)}>Sign Up</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}