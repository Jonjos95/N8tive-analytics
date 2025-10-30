import React from 'react'
import { Navbar } from './components/Navbar'
import { Sidebar } from './components/Sidebar'
import { Dashboard } from './components/Dashboard'
import Login from './auth/Login'
import { useAuth } from './auth/AuthContext'

export default function App() {
  const { state } = useAuth()
  if (!state.token) return <Login />
  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <Dashboard />
        </div>
      </div>
    </div>
  )
}
