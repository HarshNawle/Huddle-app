import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './components/ui/theme-provider'
import { Toaster } from 'sonner'
import { SocketProvider } from './context/SocketContext.jsx'

createRoot(document.getElementById('root')).render(
  <SocketProvider>
    <BrowserRouter>
      <ThemeProvider defaultTheme='dark' >
        <App />
        <Toaster position="top-center" closeButton />
      </ThemeProvider>
    </BrowserRouter>
  </SocketProvider>
)
