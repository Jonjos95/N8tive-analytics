import React from 'react'

export function Card({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-800 p-4 bg-gray-900/70 backdrop-blur card-glow">
      <div className="text-xs tracking-wide uppercase text-gray-400 mb-2">{title}</div>
      {children}
    </div>
  )
}
