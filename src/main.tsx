import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import AdminApp from './Admin'
import { StoreProvider } from './store'
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

function Root() {
  const hash = useHashRoute()
  const isAdmin = hash.startsWith('#/admin')

  return <StoreProvider>{isAdmin ? <AdminApp /> : <App />}</StoreProvider>
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
