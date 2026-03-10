import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './index.css'
import App from './App.tsx'
import { SnackbarProvider } from './presentation/context/SnackbarContext.tsx'
import { GeneralAppContextProvider } from './presentation/context/GeneralAppContext.tsx'
import { BattleContextProvider } from './presentation/context/BattleContext.tsx'
import { BrowserRouter } from 'react-router-dom'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(

  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <GeneralAppContextProvider>
        <SnackbarProvider>
          <BattleContextProvider>
            <App />
          </BattleContextProvider>
        </SnackbarProvider>
      </GeneralAppContextProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </BrowserRouter>
  </QueryClientProvider>

)
