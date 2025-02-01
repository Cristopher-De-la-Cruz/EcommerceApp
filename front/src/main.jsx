import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {App} from './App.jsx'
import { ThemeProvider } from './context/Theme/ThemeProvider.jsx'
import { Theme } from './context/Theme/Theme.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <Theme>
        <App />
      </Theme>
    </ThemeProvider>
  </StrictMode>,
)
