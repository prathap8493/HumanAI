// utils/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBxgRSuPtMMpz1K6XwEKeRGXqrsJfiVOoQ",
    authDomain: "humanai-image.firebaseapp.com",
    projectId: "humanai-image",
    storageBucket: "humanai-image.appspot.com",
    messagingSenderId: "718513334745",
    appId: "1:718513334745:web:9be7737ea5e21f22f011c8",
    measurementId: "G-R2HZ8PD37Y"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
