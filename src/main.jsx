import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App.jsx'
import { Mic } from './Mic.jsx'
import { LayoutComponent } from './LayoutComponent.jsx'
import { Video } from './Video.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    {/* < Mic /> */}
    {/* <LayoutComponent /> */}
    <Video />
  </StrictMode>,
)
