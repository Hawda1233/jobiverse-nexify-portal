
import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  UserCredential,
  User,
  signInWithPopup,
  updateProfile,
  sendEmailVerification
} from "firebase/auth";
import { auth, googleProvider, addAuthDomain } from "../lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { saveCandidateProfile, saveEmployerProfile } from "@/lib/profileOperations";
import { sendOTP, verifyOTP, checkOTPVerification } from "@/lib/otpOperations";

// New interface for user data including role
interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: "candidate" | "hr";
  company?: string;
  industry?: string;
  emailVerified?: boolean;
  otpVerified?: boolean;
}

interface AuthContextProps {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
  signup: (email: string, password: string, isHR: boolean, data?: { displayName?: string, company?: string, industry?: string }) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  loginWithGoogle: () => Promise<UserCredential>;
  logout: () => Promise<void>;
  updateUserRole: (role: "candidate" | "hr", data?: { company?: string, industry?: string }) => Promise<void>;
  sendVerificationEmail: (user: User) => Promise<void>;
  isEmailVerified: () => boolean;
  // New OTP-related methods
  sendOTPVerification: (user: User) => Promise<{ success: boolean; message?: string }>;
  verifyOTPCode: (uid: string, otp: string) => Promise<{ success: boolean; message?: string }>;
  isOTPVerified: () => boolean;
  markOTPVerified: () => Promise<void>;
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
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Initialize auth domain helper on component mount
  useEffect(() => {
    addAuthDomain();
  }, []);

  // Create user data in local storage
  const createUserData = async (user: User, role: "candidate" | "hr" = "candidate", data?: { company?: string, industry?: string }) => {
    if (!user) return;
    
    const userData: UserData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      role: role,
      emailVerified: user.emailVerified,
      otpVerified: false,
      ...data
    };
    
    // Store user data in localStorage
    localStorage.setItem(`user_data_${user.uid}`, JSON.stringify(userData));
    setUserData(userData);
    
    // Also create the appropriate profile in Firestore
    try {
      if (role === "hr" && data?.company) {
        await saveEmployerProfile({
          uid: user.uid,
          fullName: user.displayName || "",
          email: user.email || "",
          company: data.company,
          industry: data.industry || "",
          emailVerified: user.emailVerified
        });
      } else {
        await saveCandidateProfile({
          uid: user.uid,
          email: user.email || "",
          fullName: user.displayName || undefined,
          emailVerified: user.emailVerified
        });
      }
    } catch (error) {
      console.error("Error creating profile:", error);
    }
  };

  // Load user data from local storage
  const loadUserData = (user: User) => {
    if (!user) return null;
    
    const storedData = localStorage.getItem(`user_data_${user.uid}`);
    if (storedData) {
      const userData = JSON.parse(storedData) as UserData;
      // Update email verification status from current user
      userData.emailVerified = user.emailVerified;
      setUserData(userData);
      return userData;
    }
    
    // If no data exists, create default data
    createUserData(user);
    return null;
  };

  async function signup(
    email: string, 
    password: string, 
    isHR: boolean = false,
    data?: { displayName?: string, company?: string, industry?: string }
  ) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile if displayName is provided
    if (data?.displayName) {
      await updateProfile(userCredential.user, {
        displayName: data.displayName
      });
    }
    
    // Create user data with role
    await createUserData(
      userCredential.user, 
      isHR ? "hr" : "candidate",
      isHR ? { company: data?.company, industry: data?.industry } : undefined
    );
    
    return userCredential;
  }

  // Send verification email to the user
  async function sendVerificationEmail(user: User) {
    try {
      await sendEmailVerification(user);
      toast({
        title: "Verification email sent",
        description: "Please check your inbox and click the verification link to confirm your email.",
      });
    } catch (error: any) {
      console.error("Error sending verification email:", error);
      toast({
        title: "Error",
        description: `Failed to send verification email: ${error.message}`,
        variant: "destructive",
      });
      throw error;
    }
  }

  // New: Send OTP verification
  async function sendOTPVerification(user: User) {
    try {
      return await sendOTP(user);
    } catch (error: any) {
      console.error("Error sending OTP verification:", error);
      toast({
        title: "Error",
        description: `Failed to send verification code: ${error.message}`,
        variant: "destructive",
      });
      throw error;
    }
  }

  // New: Verify OTP code
  async function verifyOTPCode(uid: string, otp: string) {
    try {
      return await verifyOTP(uid, otp);
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      toast({
        title: "Error",
        description: `Failed to verify code: ${error.message}`,
        variant: "destructive",
      });
      throw error;
    }
  }

  // New: Check if user's OTP is verified
  function isOTPVerified() {
    return userData?.otpVerified || false;
  }

  // New: Mark user as OTP verified
  async function markOTPVerified() {
    if (!currentUser || !userData) return;
    
    const updatedUserData = {
      ...userData,
      otpVerified: true
    };
    
    localStorage.setItem(`user_data_${currentUser.uid}`, JSON.stringify(updatedUserData));
    setUserData(updatedUserData);
  }

  // Check if the current user's email is verified
  function isEmailVerified() {
    return currentUser?.emailVerified || false;
  }

  function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // Check if user data exists, if not create it
      const userData = loadUserData(result.user);
      if (!userData) {
        await createUserData(result.user);
      }
      return result;
    } catch (error: any) {
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
    }
  }

  function logout() {
    // Clear user data from state
    setUserData(null);
    return signOut(auth);
  }

  // Update user role
  async function updateUserRole(role: "candidate" | "hr", data?: { company?: string, industry?: string }) {
    if (!currentUser) throw new Error("No user is signed in");
    
    if (userData) {
      const updatedUserData: UserData = {
        ...userData,
        role,
        ...data
      };
      
      localStorage.setItem(`user_data_${currentUser.uid}`, JSON.stringify(updatedUserData));
      setUserData(updatedUserData);
      
      // Also update the appropriate profile in Firestore if needed
      if (role === "hr" && data?.company) {
        try {
          await saveEmployerProfile({
            uid: currentUser.uid,
            fullName: currentUser.displayName || "",
            email: currentUser.email || "",
            company: data.company,
            industry: data.industry || "",
          });
        } catch (error) {
          console.error("Error updating employer profile:", error);
        }
      }
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        loadUserData(user);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
    updateUserRole,
    sendVerificationEmail,
    isEmailVerified,
    // New OTP-related methods
    sendOTPVerification,
    verifyOTPCode,
    isOTPVerified,
    markOTPVerified
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
