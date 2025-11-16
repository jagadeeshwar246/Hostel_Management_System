import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA12e1UZghB5u3qiQ2jEaht__0fo_Jye0U",
  authDomain: "hall-management-system-8f6fc.firebaseapp.com",
  projectId: "hall-management-system-8f6fc",
  storageBucket: "hall-management-system-8f6fc.firebasestorage.app",
  messagingSenderId: "22380786881",
  appId: "1:22380786881:web:3ef804b29bbe9a0f615040"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

