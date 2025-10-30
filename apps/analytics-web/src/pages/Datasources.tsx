import React from 'react'

export default function Datasources() {
  const [sources, setSources] = React.useState<{ id: string, name: string, connected: boolean }[]>([
    { id: 'api', name: 'REST API', connected: true },
    { id: 'csv', name: 'CSV Upload', connected: false },
    { id: 'sheets', name: 'Google Sheets', connected: false },
    { id: 'sql', name: 'SQL Database', connected: false },
  ])
  return (
    <div className="p-6 space-y-3">
      <div className="text-xl font-semibold">Datasources</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {sources.map(s => (
          <div key={s.id} className="rounded-xl border border-gray-800 p-4 bg-gray-900/70">
            <div className="font-medium">{s.name}</div>
            <div className="text-xs text-gray-500 mb-3">Connect and configure</div>
            <button onClick={()=>setSources(prev=>prev.map(p=>p.id===s.id?{...p,connected:!p.connected}:p))} className={`px-3 py-1 rounded ${s.connected?'bg-emerald-600':'button-gradient text-white'}`}> {s.connected? 'Connected':'Connect'} </button>
          </div>
        ))}
      </div>
    </div>
  )
}
