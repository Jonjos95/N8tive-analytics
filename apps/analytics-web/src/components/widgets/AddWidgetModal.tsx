import React from 'react'
import { Dialog } from '@headlessui/react'

export type NewWidget = { type: 'kpi'|'line'|'bar'|'area'|'pie'|'table'|'text'|'app', title: string }

export function AddWidgetModal({ open, onClose, onAdd }: { open: boolean, onClose: ()=>void, onAdd: (w: NewWidget)=>void }) {
  const [type, setType] = React.useState<NewWidget['type']>('kpi')
  const [title, setTitle] = React.useState('New Widget')
  const submit = () => { onAdd({ type, title }); onClose() }
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-xl border border-gray-800 bg-gray-900 p-4 space-y-3">
          <Dialog.Title className="text-lg font-semibold">Add Widget</Dialog.Title>
          <div className="space-y-2">
            <label className="block text-sm">Title</label>
            <input value={title} onChange={e=>setTitle(e.target.value)} className="w-full px-3 py-2 rounded bg-gray-950 border border-gray-800" />
          </div>
          <div className="space-y-2">
            <label className="block text-sm">Type</label>
            <select value={type} onChange={e=>setType(e.target.value as any)} className="w-full px-3 py-2 rounded bg-gray-950 border border-gray-800">
              <option value="kpi">KPI Card</option>
              <option value="line">Chart: Line</option>
              <option value="bar">Chart: Bar</option>
              <option value="area">Chart: Area</option>
              <option value="pie">Chart: Pie</option>
              <option value="table">Table</option>
              <option value="text">Text / Markdown</option>
              <option value="app">Custom App Block</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={onClose} className="px-3 py-1 rounded border border-gray-700">Cancel</button>
            <button onClick={submit} className="px-3 py-1 rounded button-gradient text-white">Add</button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
