import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBGHZ-QPEZt_jVyul8subVkIcycVLzb13E",
  authDomain: "marketers-annual-sales-tracker.firebaseapp.com",
  databaseURL: "https://marketers-annual-sales-tracker-default-rtdb.firebaseio.com",
  projectId: "marketers-annual-sales-tracker",
  storageBucket: "marketers-annual-sales-tracker.firebasestorage.app",
  messagingSenderId: "572546647178",
  appId: "1:572546647178:web:4dccfa6de53af44e8f5973",
  measurementId: "G-EBYDS34RT8"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const database = getDatabase(app);
