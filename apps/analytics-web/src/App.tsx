import React from 'react'
import { motion } from 'framer-motion'
import { Navbar } from './components/Navbar'
import { Sidebar } from './components/Sidebar'
import { useAuth } from './auth/AuthContext'
import Login from './auth/Login'
import Datasources from './pages/Datasources'
import Marketplace from './pages/Marketplace'
import Settings from './pages/Settings'
import Apps from './pages/Apps'
import { AddWidgetModal, NewWidget } from './components/widgets/AddWidgetModal'
import { WidgetRenderer } from './components/widgets/WidgetRenderer'
import { Responsive, WidthProvider, Layout } from 'react-grid-layout'

const ResponsiveGridLayout = WidthProvider(Responsive)

type Widget = { id: string, type: NewWidget['type'], title: string, w: number, h: number, x: number, y: number, config?: Record<string, any> }

export default function App() {
  const { state } = useAuth()
  const [section, setSection] = React.useState('dashboard')
  const [widgets, setWidgets] = React.useState<Widget[]>(() => [
    { id: 'kpi-revenue', type: 'kpi', title: 'Total Revenue', w: 3, h: 2, x: 0, y: 0, config: { color: '#8b5cf6', metric: 'Total Revenue' } },
    { id: 'kpi-users', type: 'kpi', title: 'Active Users', w: 3, h: 2, x: 3, y: 0, config: { color: '#06b6d4', metric: 'Active Users' } },
    { id: 'kpi-conv', type: 'kpi', title: 'Conversion Rate', w: 3, h: 2, x: 6, y: 0, config: { color: '#22c55e', metric: 'Conversion Rate' } },
    { id: 'kpi-uptime', type: 'kpi', title: 'Uptime', w: 3, h: 2, x: 9, y: 0, config: { color: '#f59e0b', metric: 'Uptime' } },
    { id: 'line-rev', type: 'line', title: 'Revenue Trend', w: 6, h: 6, x: 0, y: 2, config: { color: '#8b5cf6' } },
    { id: 'bar-usage', type: 'bar', title: 'Usage', w: 6, h: 6, x: 6, y: 2, config: { color: '#6366f1' } },
    { id: 'pie-split', type: 'pie', title: 'Channel Split', w: 3, h: 4, x: 0, y: 8 },
    { id: 'table-last', type: 'table', title: 'Recent Metrics', w: 3, h: 4, x: 3, y: 8 },
  ])
  const [open, setOpen] = React.useState(false)
  const [series, setSeries] = React.useState<{ t: number, value: number }[]>([])

  const refreshMs = React.useMemo(() => +(localStorage.getItem('refresh_ms') || '1500'), [])
  const density = React.useMemo(() => localStorage.getItem('density') || 'comfortable', [])
  const rtMode = React.useMemo(() => localStorage.getItem('rt_mode') || 'timer', [])
  const sessionMinutes = React.useMemo(() => +(localStorage.getItem('session_minutes') || '0'), [])

  // Real-time source
  React.useEffect(() => {
    let timer: any
    if (rtMode === 'ws') {
      const url = (import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/ws'
      const ws = new WebSocket(url.replace('http', 'ws'))
      ws.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data)
          if (msg.type === 'kpi_update') {
            const val = msg.data.find((d: any) => d.key === 'revenue')?.value ?? 1000
            setSeries(s => [...s.slice(-60), { t: Date.now(), value: val }])
          }
        } catch {}
      }
      return () => ws.close()
    } else {
      let t = Date.now()
      timer = setInterval(() => {
        t += refreshMs
        const phase = (t/1000) % (Math.PI*2)
        const base = 950 + 120*Math.sin(phase)
        const noise = (Math.random()-0.5)*60
        const value = Math.max(800, Math.min(1250, base + noise))
        setSeries(s => [...s.slice(-60), { t, value }])
      }, refreshMs)
    }
    return () => timer && clearInterval(timer)
  }, [rtMode, refreshMs])

  // Auto-logout on inactivity
  React.useEffect(() => {
    if (!sessionMinutes) return
    let last = Date.now()
    const reset = () => { last = Date.now() }
    const id = setInterval(() => { if (Date.now() - last > sessionMinutes*60*1000) { localStorage.removeItem('n8tive_token'); window.location.reload() } }, 15000)
    window.addEventListener('mousemove', reset)
    window.addEventListener('keydown', reset)
    return () => { clearInterval(id); window.removeEventListener('mousemove', reset); window.removeEventListener('keydown', reset) }
  }, [sessionMinutes])

  if (!state.token) return <Login />

  const layouts: { [key: string]: Layout[] } = {
    lg: widgets.map((w) => ({ i: w.id, x: w.x, y: w.y, w: w.w, h: w.h }))
  }

  const onLayoutChange = (current: Layout[]) => {
    setWidgets(prev => prev.map(w => {
      const l = current.find(i => i.i === w.id)
      return l ? { ...w, x: l.x, y: l.y, w: l.w, h: l.h } : w
    }))
  }

  const onAdd = (nw: NewWidget) => {
    const id = `${nw.type}-${Date.now()}`
    const h = (nw.type==='line'||nw.type==='bar'||nw.type==='area'||nw.type==='pie')?6:2
    setWidgets(prev => [...prev, { id, type: nw.type, title: nw.title, w: 3, h, x: 0, y: Infinity, config: nw.config }])
  }

  const reset = () => { localStorage.removeItem('n8tive_layout'); window.location.reload() }
  const saveLocal = () => { localStorage.setItem('n8tive_layout', JSON.stringify(widgets)); alert('Layout saved locally') }

  React.useEffect(() => { const saved = localStorage.getItem('n8tive_layout'); if (saved) try { setWidgets(JSON.parse(saved)) } catch {} }, [])

  const rowHeight = density === 'compact' ? 44 : 56
  const margin: [number, number] = density === 'compact' ? [8,8] : [12,12]

  const dashboard = (
    <motion.div className="p-6 space-y-3" initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.25}}>
      <div className="mb-3 flex gap-2 sticky top-0 z-10">
        <button onClick={()=>setOpen(true)} className="px-3 py-1 rounded border border-gray-300 dark:border-gray-700">+ Add Widget</button>
        <button onClick={saveLocal} className="px-3 py-1 rounded text-white accent-gradient">Save Layout</button>
        <button onClick={reset} className="px-3 py-1 rounded border border-gray-300 dark:border-gray-700">Reset Dashboard</button>
      </div>
      <ResponsiveGridLayout className="layout" layouts={layouts} breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }} cols={{ lg: 12, md: 10, sm: 8, xs: 6, xxs: 4 }} margin={margin} containerPadding={[24,24]} rowHeight={rowHeight} isResizable isDraggable draggableHandle=".drag-handle" onLayoutChange={(_, all) => onLayoutChange(all.lg || [])}>
        {widgets.map(w => (
          <div key={w.id}>
            <WidgetRenderer type={w.type} title={w.title} series={series} config={w.config} />
          </div>
        ))}
      </ResponsiveGridLayout>
      <AddWidgetModal open={open} onClose={()=>setOpen(false)} onAdd={onAdd} />
    </motion.div>
  )

  return (
    <div className="theme-pro h-screen flex flex-col page-bg text-gray-900 dark:text-gray-100">
      <Navbar onSettings={()=>setSection('settings')} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar setSection={setSection} section={section} />
        <div className="flex-1 overflow-auto">
          {section==='dashboard' && dashboard}
          {section==='datasources' && <Datasources />}
          {section==='settings' && <Settings />}
          {section==='marketplace' && <Marketplace />}
          {section==='apps' && <Apps />}
        </div>
      </div>
    </div>
  )
}
