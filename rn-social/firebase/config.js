import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCdUHsi82DEH4v2QY4if_-wFln1wY1Dozo",
    authDomain: "rn-social-project-app.firebaseapp.com",
    projectId: "rn-social-project-app",
    storageBucket: "rn-social-project-app.appspot.com",
    messagingSenderId: "669399447006",
    appId: "1:669399447006:web:beabac07d4a25ba059194f",
    measurementId: "G-0EKB7141EY"
  };

// export default firebase;

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);