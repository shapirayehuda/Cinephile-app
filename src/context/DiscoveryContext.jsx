import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const DiscoveryContext = createContext(undefined)

export function DiscoveryProvider({ children }) {
  const [searchTrigger, setSearchTrigger] = useState(null)

  const submitSearch = useCallback((payload) => {
    setSearchTrigger({
      query: payload.query ?? '',
      year: payload.year ?? '',
      genre: Array.isArray(payload.genre) ? payload.genre : [],
      country: payload.country ?? '',
      nonce: Date.now(),
    })
  }, [])

  const resetToFeed = useCallback(() => {
    setSearchTrigger(null)
  }, [])

  const value = useMemo(
    () => ({ searchTrigger, submitSearch, resetToFeed }),
    [searchTrigger, submitSearch, resetToFeed],
  )

  return <DiscoveryContext.Provider value={value}>{children}</DiscoveryContext.Provider>
}

export function useDiscovery() {
  const ctx = useContext(DiscoveryContext)
  if (ctx === undefined) {
    throw new Error('useDiscovery must be used within DiscoveryProvider')
  }
  return ctx
}
