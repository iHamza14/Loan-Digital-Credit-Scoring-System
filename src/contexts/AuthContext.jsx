import React, { createContext, useContext, useState, useEffect } from 'react'
import * as authApi from '../services/authApi'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  // on mount, check if there's a saved token and restore session
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      authApi.getMe()
        .then(({ user }) => {
          setUser(user)
          setIsAdmin(user.role === 'ADMIN')
        })
        .catch(() => {
          // token is invalid or expired — clear it
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (identifier, password) => {
    const { user, token } = await authApi.login(identifier, password)
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    setUser(user)
    setIsAdmin(user.role === 'ADMIN')
    return user
  }

  const signup = async (data) => {
    const { user, token } = await authApi.signup(data)
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    setUser(user)
    setIsAdmin(user.role === 'ADMIN')
    return user
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setIsAdmin(false)
  }

  const value = {
    user,
    isAdmin,
    loading,
    login,
    signup,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}