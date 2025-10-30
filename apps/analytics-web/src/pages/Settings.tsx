import React from 'react'

const ACCENTS = ['#8b5cf6','#6366f1','#06b6d4','#22c55e','#f59e0b','#ef4444']

export default function Settings() {
  const [theme, setTheme] = React.useState<string>(() => localStorage.getItem('theme') || 'system')
  const [accent, setAccent] = React.useState<string>(() => localStorage.getItem('accent') || '#8b5cf6')
  const [density, setDensity] = React.useState<string>(() => localStorage.getItem('density') || 'comfortable')
  const [animations, setAnimations] = React.useState<boolean>(() => localStorage.getItem('animations') !== 'off')
  const [refresh, setRefresh] = React.useState<number>(() => +(localStorage.getItem('refresh_ms') || '1500'))
  const [rtMode, setRtMode] = React.useState<string>(() => localStorage.getItem('rt_mode') || 'timer')
  const [privacy, setPrivacy] = React.useState<boolean>(() => localStorage.getItem('privacy_mask') === 'on')
  const [contrast, setContrast] = React.useState<boolean>(() => document.documentElement.classList.contains('hc'))
  const [timeoutMin, setTimeoutMin] = React.useState<number>(() => +(localStorage.getItem('session_minutes') || '0'))
  const [org, setOrg] = React.useState<string>(() => localStorage.getItem('org_name') || 'N8tive')
  const [avatar, setAvatar] = React.useState<string>(() => localStorage.getItem('avatar_initials') || 'JJ')

  const apply = () => {
    // Theme
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = theme === 'dark' || (theme === 'system' && prefersDark)
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('theme', theme)

    // Accent
    document.documentElement.style.setProperty('--accent', accent)
    localStorage.setItem('accent', accent)

    // Density
    localStorage.setItem('density', density)

    // Animations
    localStorage.setItem('animations', animations ? 'on' : 'off')
    document.documentElement.style.setProperty('--anim', animations ? '1' : '0')

    // Real-time
    localStorage.setItem('rt_mode', rtMode)

    // Refresh interval
    localStorage.setItem('refresh_ms', String(refresh))

    // Privacy mask
    localStorage.setItem('privacy_mask', privacy ? 'on' : 'off')

    // High contrast
    document.documentElement.classList.toggle('hc', contrast)

    // Session timeout
    localStorage.setItem('session_minutes', String(timeoutMin))

    // Org/Avatar
    localStorage.setItem('org_name', org)
    localStorage.setItem('avatar_initials', avatar)

    alert('Settings saved')
  }

  return (
    <div className="p-6 space-y-6">
      <div className="text-xl font-semibold">Settings</div>

      <section className="rounded-xl border p-4 glass">
        <div className="font-medium mb-2">Appearance</div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Theme</label>
            <select value={theme} onChange={e=>setTheme(e.target.value)} className="w-full px-3 py-2 rounded bg-white dark:bg-gray-900 border">
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Accent Color</label>
            <div className="flex gap-2 flex-wrap">
              {ACCENTS.map(c => (
                <button key={c} onClick={()=>setAccent(c)} className={`w-7 h-7 rounded-full border ${accent.trim()===c? 'ring-2 ring-offset-2 ring-indigo-500':'border-gray-300 dark:border-gray-700'}`} style={{ background:c }} />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Density</label>
            <select value={density} onChange={e=>setDensity(e.target.value)} className="w-full px-3 py-2 rounded bg-white dark:bg-gray-900 border">
              <option value="comfortable">Comfortable</option>
              <option value="compact">Compact</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input id="anim" type="checkbox" checked={animations} onChange={e=>setAnimations(e.target.checked)} />
            <label htmlFor="anim" className="text-sm">Enable animations</label>
          </div>
          <div className="flex items-center gap-2">
            <input id="contrast" type="checkbox" checked={contrast} onChange={e=>setContrast(e.target.checked)} />
            <label htmlFor="contrast" className="text-sm">High contrast</label>
          </div>
        </div>
      </section>

      <section className="rounded-xl border p-4 glass">
        <div className="font-medium mb-2">Real-time & Data</div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Real-time source</label>
            <select value={rtMode} onChange={e=>setRtMode(e.target.value)} className="w-full px-3 py-2 rounded bg-white dark:bg-gray-900 border">
              <option value="timer">Local mock (timer)</option>
              <option value="poll">API polling</option>
              <option value="ws">WebSocket</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Data refresh interval (ms)</label>
            <input type="number" min={500} step={100} value={refresh} onChange={e=>setRefresh(+e.target.value)} className="w-full px-3 py-2 rounded bg-white dark:bg-gray-900 border" />
          </div>
          <div className="flex items-center gap-2">
            <input id="privacy" type="checkbox" checked={privacy} onChange={e=>setPrivacy(e.target.checked)} />
            <label htmlFor="privacy" className="text-sm">Mask sensitive values</label>
          </div>
        </div>
      </section>

      <section className="rounded-xl border p-4 glass">
        <div className="font-medium mb-2">Session</div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Auto-logout timeout (minutes, 0 = disabled)</label>
            <input type="number" min={0} step={1} value={timeoutMin} onChange={e=>setTimeoutMin(+e.target.value)} className="w-full px-3 py-2 rounded bg-white dark:bg-gray-900 border" />
          </div>
          <div>
            <label className="block text-sm mb-1">Organization</label>
            <input value={org} onChange={e=>setOrg(e.target.value)} className="w-full px-3 py-2 rounded bg-white dark:bg-gray-900 border" />
          </div>
          <div>
            <label className="block text-sm mb-1">Avatar initials</label>
            <input value={avatar} onChange={e=>setAvatar(e.target.value)} className="w-full px-3 py-2 rounded bg-white dark:bg-gray-900 border" />
          </div>
        </div>
      </section>

      <div className="flex gap-2">
        <button onClick={apply} className="px-3 py-1 rounded text-white accent-gradient">Save</button>
      </div>
    </div>
  )
}
