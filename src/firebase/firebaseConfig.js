// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpl5vMBxHw5tlaXf33goNgYxQHOIAdgaE",
  authDomain: "admin-project-5aa00.firebaseapp.com",
  projectId: "admin-project-5aa00",
  storageBucket: "admin-project-5aa00.appspot.com",
  messagingSenderId: "1087226184913",
  appId: "1:1087226184913:web:a4713a42e7fa7d401d31f0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// export const storage = getStorage(app);

export const db = getFirestore(app);

export default firebaseConfig;