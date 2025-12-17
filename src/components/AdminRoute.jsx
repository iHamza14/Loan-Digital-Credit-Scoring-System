import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function AdminRoute({ children }) {
  const { user, isAdmin } = useAuth()
  return user && isAdmin ? children : <Navigate to="/login" />
}