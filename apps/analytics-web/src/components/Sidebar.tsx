import React from 'react'

type Props = { setSection?: (s: string)=>void, section?: string }
export function Sidebar({ setSection, section }: Props) {
  const Item = ({ id, label }: { id: string, label: string }) => (
    <button onClick={()=>setSection && setSection(id)} className={`w-full text-left rounded px-2 py-2 border ${section===id? 'border-indigo-500 bg-gray-900 text-gray-100':'border-transparent text-gray-300 hover:border-indigo-500 hover:bg-gray-900'}`}>{label}</button>
  )
  return (
    <div className="w-64 border-r border-gray-800 p-3 space-y-2 bg-gray-950/70 backdrop-blur card-glow">
      <Item id="dashboard" label="Dashboard" />
      <Item id="datasources" label="Datasources" />
      <Item id="settings" label="Settings" />
      <Item id="marketplace" label="Marketplace" />
      <Item id="apps" label="My Apps" />
    </div>
  )
}
