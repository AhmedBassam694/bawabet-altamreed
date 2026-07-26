// Firebase Configuration

const firebaseConfig = {
  apiKey: "AIzaSyDLVKbfkhFsTGunLWEJmBN2eGg0tdqePyc",
  authDomain: "bawabet-al-tamreed.firebaseapp.com",
  projectId: "bawabet-al-tamreed",
  storageBucket: "bawabet-al-tamreed.firebasestorage.app",
  messagingSenderId: "668697400713",
  appId: "1:668697400713:web:ec5611e587dc3d3c237d58"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Authentication
const auth = firebase.auth();

// Firestore Database
const db = firebase.firestore();
