import { initializeApp } from "https://www.gstatic.com/firebasejs/x.y.z/firebase-app.js";
import { getDatabase, ref, set, push, get, child } from "https://www.gstatic.com/firebasejs/x.y.z/firebase-database.js";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export const saveVote = (productId) => {
  const votesRef = ref(database, 'votes');
  const voteRef = push(votesRef);
  const voteData = {
    productID: productId,
    timestamp: Date.now()
  };

  return set(voteRef, voteData)
    .then(() => ({ status: 'success', message: 'Voto guardado correctamente' }))
    .catch((error) => ({ status: 'error', message: error.message || 'Error al guardar el voto' }));
};