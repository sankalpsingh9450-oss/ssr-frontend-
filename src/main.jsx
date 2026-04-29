import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import { initPerformanceMonitoring } from './lib/performance'
import { registerServiceWorker } from './lib/registerServiceWorker'
import './styles/globals.css'

globalThis.__SSR_ENV__ = import.meta.env

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60_000,
      gcTime: 15 * 60_000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
})

async function bootstrap() {
  await Promise.resolve(globalThis.__SSR_LOCALHOST_BOOTSTRAP__)

  initPerformanceMonitoring()
  registerServiceWorker()

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  )
}

bootstrap()
