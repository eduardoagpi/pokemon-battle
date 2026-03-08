import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './index.css'
import App from './App.tsx'
import { SnackbarProvider } from './presentation/context/SnackbarContext.tsx'
import { GeneralAppContextProvider } from './presentation/context/GeneralAppContext.tsx'
import { BattleContextProvider } from './presentation/context/BattleContext.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <GeneralAppContextProvider>
        <SnackbarProvider>
          <BattleContextProvider>
            <App />
          </BattleContextProvider>
        </SnackbarProvider>
      </GeneralAppContextProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
