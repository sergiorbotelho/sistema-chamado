import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBccH9xs5l5SlXKjWJ0pHrVDb4RyqvXbqk",
    authDomain: "sistemachamado-96ea1.firebaseapp.com",
    projectId: "sistemachamado-96ea1",
    storageBucket: "sistemachamado-96ea1.appspot.com",
    messagingSenderId: "1052965686403",
    appId: "1:1052965686403:web:a5d046e52a02f65c8fdfb6",
    measurementId: "G-ECZCNE0V0Q"
  };

  const firebaseApp = initializeApp(firebaseConfig);

  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);
  const storage = getStorage(firebaseApp);

  export {auth, db, storage};