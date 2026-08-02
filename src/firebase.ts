import { initializeApp } from 'firebase/app'
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

const app = initializeApp(firebaseConfig)

// Firestore's default streaming transport (WebChannel) can loop
// connect/terminate forever behind certain proxies, VPNs, or security
// software. Auto-detecting long-polling instead is Firebase's documented
// workaround and falls back to the normal transport when it's not needed.
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
})
export const auth = getAuth(app)
