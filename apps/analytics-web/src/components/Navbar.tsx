import React from 'react'
import { ThemeToggle } from '../theme/ThemeToggle'
import { useAuth } from '../auth/AuthContext'

export function Navbar({ onSettings }: { onSettings?: ()=>void }) {
  const { state, logout } = useAuth()
  const [org, setOrg] = React.useState('N8tive')
  const [avatar, setAvatar] = React.useState('JJ')
  React.useEffect(() => {
    try {
      const o = localStorage.getItem('org_name') || 'N8tive'
      const a = localStorage.getItem('avatar_initials') || 'JJ'
      setOrg(o); setAvatar(a)
      const acc = localStorage.getItem('accent'); if (acc) document.documentElement.style.setProperty('--accent', acc)
    } catch {}
  }, [])
  return (
    <div className="h-14 border-b border-gray-200 dark:border-gray-800 flex items-center px-4 justify-between bg-white/80 dark:bg-gray-950/70 backdrop-blur card-glow">
      <div className="flex items-center gap-2">
        <div className="text-lg font-bold"><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">{org}</span><span className="text-gray-700 dark:text-gray-200">.io</span></div>
        <div className="text-sm text-gray-500 dark:text-gray-400">Analytics</div>
      </div>
      <div className="flex-1 px-4">
        <input placeholder="Search..." className="w-full max-w-lg px-3 py-1.5 rounded-md bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 text-sm outline-none focus:border-indigo-500" />
      </div>
      <div className="flex items-center gap-3">
        <button onClick={onSettings} title="Settings" className="text-sm px-2 py-1 rounded border border-gray-300 dark:border-gray-700">⚙️</button>
        <ThemeToggle />
        {state.token && <button onClick={logout} className="text-sm px-2 py-1 rounded border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-500">Logout</button>}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo( --accent) to-purple-600 flex items-center justify-center text-xs font-semibold text-white" style={{ background: 'linear-gradient(135deg, var(--accent), #8b5cf6)' }}>{avatar}</div>
      </div>
    </div>
  )
}
