import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ApplyLoan from './pages/ApplyLoan'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'
import Score from './pages/Score'
import Help from './pages/Help'
import Notifications from './pages/Notification'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'
import CreditAnalytics from './pages/CreditAnalytics'
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white transition-colors duration-300">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/help" element={<Help />} />
              <Route 
                path="/apply-loan" 
                element={
                  <PrivateRoute>
                    <ApplyLoan />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/dashboard/score" 
                element={
                  <PrivateRoute>
                    <Score />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/credit-analytics" 
                element={
                  <PrivateRoute>
                    <CreditAnalytics />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <Admin />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/notifications" 
                element={
                  <PrivateRoute>
                    <Notifications />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App