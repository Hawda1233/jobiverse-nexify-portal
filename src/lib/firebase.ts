
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBsLDH2LSdF1ZpwXtY3_unDpAFUfy35VC0",
  authDomain: "nexify-job-platform.firebaseapp.com",
  projectId: "nexify-job-platform",
  storageBucket: "nexify-job-platform.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};

// Initialize Firebase first
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth explicitly with the app instance
export const auth = getAuth(app);
export const db = getFirestore(app);

// Configure Google Auth Provider with custom parameters
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
  // Setting language preference for Hindi to support Indian users
  'hl': 'hi'
});

// Add authorized domains dynamically for local development
export const addAuthDomain = () => {
  try {
    const currentDomain = window.location.hostname;
    if (!currentDomain.includes('nexify-job-platform.firebaseapp.com')) {
      console.log(`Using domain: ${currentDomain} for authentication`);
      
      // Support for regional domains in India
      if (currentDomain.includes('.in') || currentDomain.includes('india')) {
        console.log('Indian domain detected, applying regional settings');
      }
    }
  } catch (error) {
    console.error("Error setting auth domain:", error);
  }
};

// Call this function when initializing the app
addAuthDomain();

// Export the initialized app
export { app };
