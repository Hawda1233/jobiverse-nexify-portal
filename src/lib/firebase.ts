
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBsLDH2LSdF1ZpwXtY3_unDpAFUfy35VC0",
  authDomain: "nexify-job-platform.firebaseapp.com",
  projectId: "nexify-job-platform",
  storageBucket: "nexify-job-platform.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
