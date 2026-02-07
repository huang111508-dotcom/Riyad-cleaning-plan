import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCog0g7CW7oUiebY8okhbTLnHKOTLuBECY",
  authDomain: "riyadh-cleaning-plan.firebaseapp.com",
  projectId: "riyadh-cleaning-plan",
  storageBucket: "riyadh-cleaning-plan.firebasestorage.app",
  messagingSenderId: "626899538944",
  appId: "1:626899538944:web:e0b619bc54fa248c4ab4e5"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
