import React from 'react'

export function ThemeToggle() {
  const [dark, setDark] = React.useState(() => localStorage.getItem('theme') === 'dark')
  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])
  return (
    <button onClick={() => setDark(d => !d)} className="text-sm rounded px-2 py-1 border border-gray-300 dark:border-gray-700">
      {dark ? 'Light' : 'Dark'}
    </button>
  )
}
