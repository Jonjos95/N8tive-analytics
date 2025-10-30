import React from 'react'

// Initialize theme immediately from localStorage
(function initTheme(){
  try {
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const dark = saved ? saved === 'dark' : prefersDark
    document.documentElement.classList.toggle('dark', dark)
  } catch {}
})()

export function ThemeToggle() {
  const [dark, setDark] = React.useState(() => document.documentElement.classList.contains('dark'))
  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])
  return (
    <button onClick={() => setDark(d => !d)} className="text-sm rounded px-2 py-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-transparent text-gray-800 dark:text-gray-200">
      {dark ? 'Light' : 'Dark'}
    </button>
  )
}
