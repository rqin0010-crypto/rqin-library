import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBIsE5EQejPYni5TT6nqiduPEK9DEO5ODA',
  authDomain: 'fit5032-6fb55.firebaseapp.com',
  projectId: 'fit5032-6fb55',
  storageBucket: 'fit5032-6fb55.firebasestorage.app',
  messagingSenderId: '233359894068',
  appId: '1:233359894068:web:14847e0d0fd9eba3010c61'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Cloud Firestore
const db = getFirestore(app)

// Export Firestore database
export default db