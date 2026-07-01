import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyB7qlwyxdRAllRtqDxlZHGqFV8KyxetS4A",
    authDomain: "salon-booking-website-5ea4a.firebaseapp.com",
    projectId: "salon-booking-website-5ea4a",
    storageBucket: "salon-booking-website-5ea4a.firebasestorage.app",
    messagingSenderId: "380215886386",
    appId: "1:380215886386:web:70238b6179f3e93ba0322b",
    measurementId: "G-SKHMCB9E5K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

console.log("Firebase connected 🚀");

// export database so other files can use it
export { db };