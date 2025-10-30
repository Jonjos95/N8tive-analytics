import React from 'react'
import { Card } from '../Card'
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#6366f1', '#06b6d4', '#8b5cf6', '#22c55e', '#f59e0b']

function isDark() { return document.documentElement.classList.contains('dark') }
const grid = () => getComputedStyle(document.documentElement).getPropertyValue('--grid-stroke') || (isDark()? '#222' : '#e5e7eb')
const axis = () => getComputedStyle(document.documentElement).getPropertyValue('--axis-stroke') || (isDark()? '#666' : '#475569')

const masked = () => localStorage.getItem('privacy_mask') === 'on'

type Props = { type: string, title: string, series: any[], config?: Record<string, any> }

export function WidgetRenderer({ type, title, series, config }: Props) {
  const accent = config?.color || '#8b5cf6'
  if (type === 'kpi') {
    if (masked()) return <Card title={title}><div className="text-3xl font-bold" style={{ color: accent }}>•••</div></Card>
    const metric = (config?.metric || title || '').toLowerCase()
    let value = 0
    if (metric.includes('revenue')) value = series[series.length-1]?.value ?? 0
    else if (metric.includes('user')) value = Math.round(500 + Math.random()*200)
    else if (metric.includes('conversion')) value = +(2 + Math.random()*3).toFixed(2)
    else if (metric.includes('uptime')) value = +(99.7 + Math.random()*0.2).toFixed(3)
    return <Card title={title}><div className="text-3xl font-bold" style={{ color: accent }}>{value.toLocaleString()}</div></Card>
  }
  if (type === 'line') {
    return <ChartShell title={title}><LineChart data={series}><Line dataKey="value" stroke={accent} strokeWidth={2} dot={false} /><CartesianGrid stroke={grid()} /><XAxis dataKey="t" tick={false} stroke={axis()} /><YAxis stroke={axis()} /><Tooltip /></LineChart></ChartShell>
  }
  if (type === 'bar') {
    return <ChartShell title={title}><BarChart data={series}><Bar dataKey="value" fill={accent} radius={[6,6,0,0]} /><CartesianGrid stroke={grid()} /><XAxis dataKey="t" tick={false} stroke={axis()} /><YAxis stroke={axis()} /><Tooltip /></BarChart></ChartShell>
  }
  if (type === 'area') {
    return <ChartShell title={title}><AreaChart data={series}><Area dataKey="value" stroke={accent} fill={accent} fillOpacity={0.2} /><CartesianGrid stroke={grid()} /><XAxis dataKey="t" tick={false} stroke={axis()} /><YAxis stroke={axis()} /><Tooltip /></AreaChart></ChartShell>
  }
  if (type === 'pie') {
    const pie = [{ name: 'A', value: 40 }, { name: 'B', value: 25 }, { name: 'C', value: 35 }]
    return (
      <ChartShell title={title}>
        <PieChart>
          <Pie data={pie} dataKey="value" nameKey="name" outerRadius={80}>
            {pie.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ChartShell>
    )
  }
  if (type === 'table') {
    return (
      <Card title={title}>
        <table className="w-full text-sm">
          <thead style={{ color: 'var(--text-muted)' }}><tr><th className="text-left">Time</th><th className="text-right">Value</th></tr></thead>
          <tbody>
            {series.slice(-10).map((d, i) => (<tr key={i}><td>{new Date(d.t).toLocaleTimeString()}</td><td className="text-right">{masked()? '•••' : d.value.toFixed(2)}</td></tr>))}
          </tbody>
        </table>
      </Card>
    )
  }
  if (type === 'text') {
    return <Card title={title}><div className="text-sm" style={{ color: 'var(--text-muted)' }}>Write notes or markdown here.</div></Card>
  }
  if (type === 'app') {
    return <Card title={title}><div className="text-sm" style={{ color: 'var(--text-muted)' }}>Embedded app placeholder</div></Card>
  }
  return null
}

function ChartShell({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="rounded-xl border p-2 glass h-full">
      <div className="text-xs tracking-wide uppercase mb-2" style={{ color: 'var(--text-muted)' }}>{title}</div>
      <div style={{ width: '100%', height: '100%' }}>
        <ResponsiveContainer>
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
