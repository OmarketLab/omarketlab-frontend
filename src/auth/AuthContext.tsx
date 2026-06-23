import { createContext, useContext, useState, type ReactNode } from 'react'

interface AuthContextValue {
  isAuthenticated: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const STORAGE_KEY = 'omarketlab.auth'

export function AuthProvider({ children }: { children: ReactNode }) {
  // mock 로그인 상태 — 새로고침 후에도 유지되도록 localStorage 사용
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem(STORAGE_KEY) === '1',
  )

  const login = () => {
    localStorage.setItem(STORAGE_KEY, '1')
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
