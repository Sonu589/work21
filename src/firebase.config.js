// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCu4jdYvn3B5Bv37fCeWZu3hSljUMH4t7w",
  authDomain: "sample-22e72.firebaseapp.com",
  projectId: "sample-22e72",
  storageBucket: "sample-22e72.appspot.com",
  messagingSenderId: "755521778433",
  appId: "1:755521778433:web:d311fe6954d84dc0ea2100",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);


