import React from 'react'

type AppItem = { id: string; name: string; desc: string; category: string; tags: string[] }

const ALL_APPS: AppItem[] = [
  { id: 'pm', name: 'Project Manager', desc: 'Plan sprints, tasks, and timelines.', category: 'Productivity', tags: ['kanban','sprints'] },
  { id: 'fleet', name: 'Fleet Dashboard', desc: 'Track vehicles and routes.', category: 'Operations', tags: ['map','gps'] },
  { id: 'finance', name: 'Finance Tracker', desc: 'Budgets, cash flow, and KPIs.', category: 'Finance', tags: ['budget','forecast'] },
  { id: 'crm', name: 'CRM Metrics', desc: 'Pipeline health and conversions.', category: 'Sales', tags: ['crm','sales'] },
  { id: 'ai-chat', name: 'AI Chat', desc: 'Embedded assistant for your data.', category: 'AI', tags: ['chat','llm'] },
  { id: 'tickets', name: 'Support Desk', desc: 'Tickets, SLAs, and satisfaction.', category: 'Support', tags: ['sla','helpdesk'] },
  { id: 'marketing', name: 'Marketing Hub', desc: 'Campaigns, traffic, attribution.', category: 'Marketing', tags: ['ads','utm'] },
  { id: 'warehouse', name: 'Warehouse Ops', desc: 'Inventory and throughput.', category: 'Operations', tags: ['inventory'] },
  { id: 'security', name: 'Security Center', desc: 'Alerts and posture score.', category: 'Security', tags: ['siem'] },
  { id: 'okrs', name: 'OKRs', desc: 'Objectives, results, and progress.', category: 'Productivity', tags: ['goals'] },
]

const CATEGORIES = ['All','Productivity','Operations','Finance','Sales','AI','Support','Marketing','Security']

export default function Marketplace() {
  const [query, setQuery] = React.useState('')
  const [cat, setCat] = React.useState('All')
  const [installed, setInstalled] = React.useState<Record<string, boolean>>({})

  const apps = ALL_APPS.filter(a => (cat==='All' || a.category===cat) && (a.name+a.desc+a.tags.join(' ')).toLowerCase().includes(query.toLowerCase()))

  const toggle = (id: string) => setInstalled(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="text-xl font-semibold">Marketplace</div>
        <div className="flex gap-2">
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search apps..." className="px-3 py-2 rounded-md bg-gray-950 border border-gray-800" />
          <select value={cat} onChange={e=>setCat(e.target.value)} className="px-3 py-2 rounded-md bg-gray-950 border border-gray-800">
            {CATEGORIES.map(c=> <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {apps.map(a => (
          <div key={a.id} className="rounded-xl border border-gray-800 p-4 bg-gray-900/70 flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <div className="font-medium">{a.name}</div>
              <span className="text-[10px] px-2 py-0.5 rounded-full border border-gray-700 text-gray-400">{a.category}</span>
            </div>
            <div className="text-xs text-gray-500 mb-3">{a.desc}</div>
            <div className="flex gap-2 mb-4">
              {a.tags.map(t => <span key={t} className="text-[10px] px-2 py-0.5 rounded-full border border-gray-700 text-gray-400">#{t}</span>)}
            </div>
            <div className="mt-auto flex gap-2">
              <button onClick={()=>toggle(a.id)} className={`px-3 py-1 rounded ${installed[a.id] ? 'bg-emerald-600' : 'button-gradient text-white'}`}>{installed[a.id] ? 'Installed' : 'Install'}</button>
              <button className="px-3 py-1 rounded border border-gray-700">Open</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
