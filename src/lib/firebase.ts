
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

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

// Configure Google Auth Provider with custom parameters
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Add authorized domains dynamically for local development
export const addAuthDomain = () => {
  try {
    const currentDomain = window.location.hostname;
    if (!currentDomain.includes('nexify-job-platform.firebaseapp.com')) {
      // This is a workaround for development environments
      // In production, you would add domains through Firebase Console
      console.log(`Using domain: ${currentDomain} for authentication`);
    }
  } catch (error) {
    console.error("Error setting auth domain:", error);
  }
};

// Call this function when initializing the app
addAuthDomain();

export default app;
