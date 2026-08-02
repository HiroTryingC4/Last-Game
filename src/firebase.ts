import { initializeApp, getApps } from 'firebase/app'
import { initializeFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyDjZhSKdAdch2CZ3cENr8uY34MGT58YZG4',
  authDomain: 'last-game-5eac8.firebaseapp.com',
  projectId: 'last-game-5eac8',
  storageBucket: 'last-game-5eac8.firebasestorage.app',
  messagingSenderId: '1063619830642',
  appId: '1:1063619830642:web:34926f368a5c1cd825f3eb',
}

const app = getApps().find((a) => a.name === '[DEFAULT]') ?? initializeApp(firebaseConfig)

// A second, isolated Firebase app just for creating new admin accounts.
// Firebase's client SDK signs you in as whatever account you just created —
// without a separate app instance, an admin creating a new account would
// get logged out of their own session and into the brand-new one.
const secondaryApp =
  getApps().find((a) => a.name === 'Secondary') ?? initializeApp(firebaseConfig, 'Secondary')

// Firestore's default streaming transport (WebChannel) can loop
// connect/terminate forever behind certain proxies, VPNs, or security
// software. Auto-detecting long-polling instead is Firebase's documented
// workaround and falls back to the normal transport when it's not needed.
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
})
export const auth = getAuth(app)
export const secondaryAuth = getAuth(secondaryApp)
