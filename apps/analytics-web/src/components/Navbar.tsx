import React from 'react'
import { ThemeToggle } from '../theme/ThemeToggle'
import { useAuth } from '../auth/AuthContext'

export function Navbar() {
  const { state, logout } = useAuth()
  return (
    <div className="h-14 border-b border-gray-800 flex items-center px-4 justify-between bg-gray-950/70 backdrop-blur card-glow">
      <div className="font-semibold text-gray-100">N8tive Analytics</div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        {state.token && <button onClick={logout} className="text-sm px-2 py-1 rounded border border-gray-700 text-gray-300 hover:border-indigo-500">Logout</button>}
      </div>
    </div>
  )}
