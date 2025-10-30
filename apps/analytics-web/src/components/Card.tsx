import React from 'react'
import { motion } from 'framer-motion'

export function Card({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <motion.div
      className={`rounded-xl border p-4 glass shimmer glass-noise`}
      initial={{ y: 12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 18 }}
      whileHover={{ translateY: -3 }}
    >
      <div className="text-xs tracking-wide uppercase card-title drag-handle cursor-move select-none">{title}</div>
      {children}
    </motion.div>
  )
}
