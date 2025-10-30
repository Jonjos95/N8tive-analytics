import React from 'react'

export function Sidebar() {
  return (
    <div className="w-56 border-r border-gray-800 p-3 space-y-2 bg-gray-950/70 backdrop-blur card-glow">
      <a className="block rounded px-2 py-2 hover:bg-gray-900 border border-transparent hover:border-indigo-500 text-gray-300" href="#">Dashboard</a>
      <a className="block rounded px-2 py-2 hover:bg-gray-900 border border-transparent hover:border-indigo-500 text-gray-300" href="#">Datasources</a>
      <a className="block rounded px-2 py-2 hover:bg-gray-900 border border-transparent hover:border-indigo-500 text-gray-300" href="#">Settings</a>
    </div>
  )
}
