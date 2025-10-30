import React from 'react'
import { Card } from './Card'
import { Responsive, WidthProvider, Layout } from 'react-grid-layout'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useAuth } from '../auth/AuthContext'

const ResponsiveGridLayout = WidthProvider(Responsive)

type Widget = {
  id: string
  type: 'kpi' | 'chart'
  title: string
  w: number
  h: number
  x: number
  y: number
  config?: Record<string, any>
}

export function Dashboard() {
  const { state } = useAuth()
  const [kpis, setKpis] = React.useState<{ key: string, value: number }[]>([])
  const [series, setSeries] = React.useState<{ t: number, value: number }[]>([])
  const [widgets, setWidgets] = React.useState<Widget[]>([])
  const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:8000')

  React.useEffect(() => {
    if (!state.token) return
    fetch(`${apiBase}/dashboard`, { headers: { Authorization: `Bearer ${state.token}` } })
      .then(r => r.ok ? r.json() : { widgets: [] })
      .then(d => setWidgets(d.widgets || []))
      .catch(() => setWidgets([]))
  }, [state.token])

  React.useEffect(() => {
    const url = `${apiBase}/ws`
    const ws = new WebSocket(url.replace('http', 'ws'))
    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data)
        if (msg.type === 'kpi_update') {
          setKpis(msg.data)
          const rev = msg.data.find((d: any) => d.key === 'revenue')
          if (rev) setSeries((s) => [...s.slice(-40), { t: Date.now(), value: rev.value }])
        }
      } catch {}
    }
    return () => ws.close()
  }, [])

  const layouts: { [key: string]: Layout[] } = {
    lg: widgets.map((w) => ({ i: w.id, x: w.x, y: w.y, w: w.w, h: w.h }))
  }

  const addWidget = (type: 'kpi' | 'chart') => {
    const title = prompt('Widget title?', type === 'kpi' ? 'KPI' : 'Chart') || (type === 'kpi' ? 'KPI' : 'Chart')
    const id = `${type}-${Date.now()}`
    const next: Widget = { id, type, title, w: 3, h: 2, x: 0, y: Infinity, config: {} }
    setWidgets((ws) => [...ws, next])
  }

  const onLayoutChange = (current: Layout[]) => {
    setWidgets(widgets.map(w => {
      const l = current.find(i => i.i === w.id)
      return l ? { ...w, x: l.x, y: l.y, w: l.w, h: l.h } : w
    }))
  }

  const save = async () => {
    if (!state.token) return
    await fetch(`${apiBase}/dashboard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${state.token}` },
      body: JSON.stringify({ widgets })
    })
    alert('Dashboard saved')
  }

  const renderWidget = (w: Widget) => {
    if (w.type === 'kpi') {
      const val = kpis.find(k=>k.key==='revenue')?.value ?? 0
      return (
        <Card title={w.title}>
          <div className="text-3xl font-bold text-indigo-400">{val.toLocaleString()}</div>
        </Card>
      )
    }
    return (
      <div className="rounded-xl border border-gray-800 p-2 bg-gray-900/70 backdrop-blur card-glow h-full">
        <div className="text-xs tracking-wide uppercase text-gray-400 mb-2">{w.title}</div>
        <div style={{ width: '100%', height: '100%' }}>
          <ResponsiveContainer>
            <LineChart data={series} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <Line type="monotone" dataKey="value" stroke="#8b5cf6" dot={false} />
              <CartesianGrid stroke="#222" />
              <XAxis dataKey="t" tickFormatter={() => ''} stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip labelFormatter={() => ''} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-900 text-gray-100 min-h-full relative">
      <div className="mb-4 flex gap-2 sticky top-0 z-10">
        <button onClick={()=>addWidget('kpi')} className="px-3 py-1 rounded border border-gray-700 text-gray-300 hover:border-indigo-500">Add KPI</button>
        <button onClick={()=>addWidget('chart')} className="px-3 py-1 rounded border border-gray-700 text-gray-300 hover:border-indigo-500">Add Chart</button>
        <button onClick={save} className="px-3 py-1 rounded text-white button-gradient">Save</button>
      </div>
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 8, xs: 6, xxs: 4 }}
        rowHeight={56}
        isResizable
        isDraggable
        onLayoutChange={(_, all) => onLayoutChange(all.lg || [])}
      >
        {widgets.map(w => (
          <div key={w.id}>
            {renderWidget(w)}
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  )
}
