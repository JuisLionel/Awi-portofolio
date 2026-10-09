import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import AOS from 'aos'
import 'aos/dist/aos.css'
import './index.css'
import App from './App.jsx'

AOS.init({
  duration: 700,
  easing: 'ease-out-cubic',
  once: false,
  offset: 60,
  // Respect the OS "reduce motion" accessibility setting.
  disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)