import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { AuthProvider } from './auth/AuthContext'

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
)

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  document.body.style.setProperty('--bg-shift', String(Math.min(60, y*0.05))+'px');
});
