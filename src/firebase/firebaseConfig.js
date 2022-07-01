// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBNT6vO7Uy6-5qR6DQytflG_p_svacGNLg",
  authDomain: "admin-4f139.firebaseapp.com",
  projectId: "admin-4f139",
  storageBucket: "admin-4f139.appspot.com",
  messagingSenderId: "476854953688",
  appId: "1:476854953688:web:0e74941d354f7808e559ad",
  measurementId: "G-52FBL6TV4M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// export const storage = getStorage(app);

export const db = getFirestore(app);

export default firebaseConfig;