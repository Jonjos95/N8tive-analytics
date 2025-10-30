import React from 'react'
import { useAuth } from './AuthContext'

export default function Login() {
  const { login } = useAuth()
  const [username, setUsername] = React.useState('demo@n8tive.io')
  const [password, setPassword] = React.useState('password')
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await login(username, password)
    } catch (e: any) {
      setError('Load failed')
    } finally { setLoading(false) }
  }

  // create a few floating particles
  React.useEffect(() => {
    const container = document.getElementById('particles')
    if (!container) return
    container.innerHTML = ''
    for (let i = 0; i < 24; i++) {
      const d = document.createElement('div')
      d.className = 'particle'
      const size = 2 + Math.random()*4
      d.style.width = `${size}px`
      d.style.height = `${size}px`
      d.style.left = `${Math.random()*100}%`
      d.style.top = `${Math.random()*100}%`
      d.style.animationDelay = `${Math.random()*10}s`
      d.style.setProperty('--tx', `${(Math.random()-0.5)*200}vw`)
      d.style.setProperty('--ty', `${(Math.random()-0.5)*200}vh`)
      container.appendChild(d)
    }
  }, [])

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen relative bg-grid">
      <div id="particles" className="pointer-events-none fixed inset-0 z-0"></div>
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <form onSubmit={onSubmit} className="w-96 space-y-4 bg-gray-900/80 backdrop-blur-xl p-8 rounded-2xl border border-gray-800 card-glow">
          <div className="text-2xl font-bold">Sign in</div>
          {error && <div className="text-sm text-red-400">{error}</div>}
          <input className="w-full px-3 py-2 rounded-md bg-gray-950 border border-gray-800 focus:border-indigo-500 outline-none" value={username} onChange={e=>setUsername(e.target.value)} placeholder="Email" />
          <input className="w-full px-3 py-2 rounded-md bg-gray-950 border border-gray-800 focus:border-indigo-500 outline-none" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" />
          <button disabled={loading} className="w-full py-2 rounded-md button-gradient text-white hover:opacity-95 transition disabled:opacity-50">{loading? 'Signing in...' : 'Sign in'}</button>
        </form>
      </div>
    </div>
  )
}
