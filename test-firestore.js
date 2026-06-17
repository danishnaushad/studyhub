import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyDX2zxe6aXpKjMjepV0vo0-4RAm8EfbuHo",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "studio-9647175845-219b2.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "studio-9647175845-219b2",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "studio-9647175845-219b2.firebasestorage.app",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "880554041282",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:880554041282:web:a9773e3689e6dab2d1005b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  const snapshot = await getDocs(collection(db, 'categories'));
  console.log(`Found ${snapshot.docs.length} categories.`);
  snapshot.docs.forEach(doc => {
    console.log("Category Document:", doc.id, doc.data());
  });
  
  const usersSnapshot = await getDocs(collection(db, 'users'));
  console.log(`Found ${usersSnapshot.docs.length} users.`);
  usersSnapshot.docs.forEach(doc => {
    console.log("User Document:", doc.id, doc.data().uid);
  });
  process.exit(0);
}

run().catch(console.error);
