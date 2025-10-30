import React from 'react'

type AuthState = { token: string | null }
const AuthCtx = React.createContext<{ state: AuthState, login: (u: string, p: string) => Promise<void>, logout: () => void }>({ state: { token: null }, login: async()=>{}, logout: ()=>{} })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = React.useState<string | null>(() => localStorage.getItem('n8tive_token'))
  const login = async (username: string, password: string) => {
    const base = import.meta.env.VITE_AUTH_URL || 'http://localhost:8001'
    const body = new URLSearchParams({ username, password })
    const res = await fetch(`${base}/token`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body })
    if (!res.ok) throw new Error('Login failed')
    const data = await res.json()
    localStorage.setItem('n8tive_token', data.access_token)
    setToken(data.access_token)
  }
  const logout = () => { localStorage.removeItem('n8tive_token'); setToken(null) }
  return <AuthCtx.Provider value={{ state: { token }, login, logout }}>{children}</AuthCtx.Provider>
}

export function useAuth() { return React.useContext(AuthCtx) }
