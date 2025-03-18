
import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  UserCredential,
  User,
  signInWithPopup
} from "firebase/auth";
import { auth, googleProvider, addAuthDomain } from "../lib/firebase";
import { useToast } from "@/hooks/use-toast";

interface AuthContextProps {
  currentUser: User | null;
  loading: boolean;
  signup: (email: string, password: string) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  loginWithGoogle: () => Promise<UserCredential>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Initialize auth domain helper on component mount
  useEffect(() => {
    addAuthDomain();
  }, []);

  function signup(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function loginWithGoogle() {
    return signInWithPopup(auth, googleProvider)
      .catch((error) => {
        console.error("Google sign-in error:", error);
        
        // Handle common Firebase errors
        if (error.code === 'auth/unauthorized-domain') {
          toast({
            title: "Authentication Error",
            description: "This domain is not authorized for Google authentication. We've attempted to fix this. Please try again or use email sign-in.",
            variant: "destructive",
          });
        } else if (error.code === 'auth/popup-closed-by-user') {
          toast({
            title: "Sign-in Cancelled",
            description: "You closed the Google sign-in popup. Try again when you're ready.",
            variant: "default",
          });
        } else if (error.code === 'auth/popup-blocked') {
          toast({
            title: "Popup Blocked",
            description: "Pop-up was blocked by your browser. Please allow pop-ups for this website and try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Authentication Error",
            description: `Error: ${error.message || "There was a problem signing in with Google. Please try again later."}`,
            variant: "destructive",
          });
        }
        
        throw error;
      });
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
