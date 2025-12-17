import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  const login = (userData) => {
    setUser(userData)
    setIsAdmin(userData?.email === 'admin' || userData?.role === 'admin')
  }

  const logout = () => {
    setUser(null)
    setIsAdmin(false)
  }

  const value = {
    user,
    isAdmin,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}