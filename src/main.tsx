import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import AdminApp from './Admin'
import { StoreProvider, useStore, FullScreenLoader } from './store'
import './index.css'

function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash)

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return hash
}

function AppGate({ isAdmin }: { isAdmin: boolean }) {
  const { loading, error } = useStore()
  if (error) {
    return (
      <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center px-6">
        <p className="max-w-md text-sm text-[#c25c5c] text-center leading-relaxed">{error}</p>
      </div>
    )
  }
  if (loading) return <FullScreenLoader />
  return isAdmin ? <AdminApp /> : <App />
}

function Root() {
  const hash = useHashRoute()
  const isAdmin = hash.startsWith('#/admin')

  return (
    <StoreProvider>
      <AppGate isAdmin={isAdmin} />
    </StoreProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
