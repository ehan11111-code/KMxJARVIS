'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { CLIENTS, DEFAULT_CLIENT } from '@/lib/client'

const STORAGE_KEY = 'km_client'

type ClientContextValue = {
  clientId: string
  setClientId: (id: string) => void
}

const ClientContext = createContext<ClientContextValue>({
  clientId: DEFAULT_CLIENT,
  setClientId: () => {}
})

const isKnown = (id: string | null): id is string => !!id && CLIENTS.some((c) => c.id === id)

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const [clientId, setClientIdState] = useState<string>(DEFAULT_CLIENT)

  // Hydrate from localStorage after mount (avoids SSR mismatch — same pattern as theme).
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (isKnown(stored)) setClientIdState(stored)
    } catch {
      /* ignore */
    }
  }, [])

  const setClientId = (id: string) => {
    if (!isKnown(id)) return
    setClientIdState(id)
    try {
      localStorage.setItem(STORAGE_KEY, id)
    } catch {
      /* ignore */
    }
  }

  return <ClientContext.Provider value={{ clientId, setClientId }}>{children}</ClientContext.Provider>
}

export function useActiveClient() {
  return useContext(ClientContext)
}
