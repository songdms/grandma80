
// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAp7lUGLoovfQ2S0uwxEgPprdx4aFWtQvs",
  authDomain: "grandma80-3ae74.firebaseapp.com",
  projectId: "grandma80-3ae74",
  storageBucket: "grandma80-3ae74.firebasestorage.app",
  messagingSenderId: "730612973802",
  appId: "1:730612973802:web:38e4d7e69b3b17e499d793"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Firestore 생성
const db = getFirestore(app);

// 다른 파일에서 사용할 수 있도록 내보내기
export { db };