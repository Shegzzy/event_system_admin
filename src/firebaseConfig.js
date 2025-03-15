// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDEI74sAPEARKMfi_gANKcSJLVD1DMa_bA",
  authDomain: "event-management-4a6c4.firebaseapp.com",
  projectId: "event-management-4a6c4",
  storageBucket: "event-management-4a6c4.firebasestorage.app",
  messagingSenderId: "1070703923191",
  appId: "1:1070703923191:web:ae6fa6b8671b991618e8f2",
  measurementId: "G-QCMHVDJK3W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
const analytics = getAnalytics(app);