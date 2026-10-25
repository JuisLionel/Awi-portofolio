import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import AOS from 'aos'
import 'aos/dist/aos.css'
import '@/styles/index.css'
import App from '@/app/App.jsx'

window.history.scrollRestoration = 'manual'

AOS.init({
  duration: 700,
  easing: 'ease-out-cubic',
  once: false,
  offset: 60,
  disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)