
import { db } from "./firebase";
import { collection, doc, setDoc, getDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { User } from "firebase/auth";
import { sendEmailVerificationWithOTP } from "./emailService";

// Collection references
const otpCollection = collection(db, "otpVerifications");

// Interface for OTP data
interface OTPData {
  uid: string;
  email: string;
  otp: string;
  createdAt: any; // Firestore Timestamp
  expiresAt: any; // Firestore Timestamp
  verified: boolean;
}

// Function to generate a random 6-digit OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Function to send OTP to user's email
export const sendOTP = async (user: User): Promise<{ success: boolean; message?: string }> => {
  try {
    // Generate a 6-digit OTP
    const otp = generateOTP();
    
    // Set expiry time (5 minutes from now)
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes later
    
    // Store OTP in Firestore with expiry
    await setDoc(doc(otpCollection, user.uid), {
      uid: user.uid,
      email: user.email,
      otp: otp,
      createdAt: serverTimestamp(),
      expiresAt: expiresAt,
      verified: false
    });
    
    // Send email with OTP
    await sendEmailVerificationWithOTP(user.email || "", otp);
    
    return { success: true };
  } catch (error) {
    console.error("Error sending OTP:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Failed to send OTP" 
    };
  }
};

// Function to verify OTP entered by the user
export const verifyOTP = async (
  uid: string, 
  enteredOTP: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    // Get the stored OTP record
    const otpRef = doc(otpCollection, uid);
    const otpDoc = await getDoc(otpRef);
    
    if (!otpDoc.exists()) {
      return { success: false, message: "No verification code found. Please request a new one." };
    }
    
    const otpData = otpDoc.data() as OTPData;
    const now = new Date();
    const expiryDate = otpData.expiresAt.toDate();
    
    // Check if OTP has expired
    if (now > expiryDate) {
      // Delete expired OTP
      await deleteDoc(otpRef);
      return { success: false, message: "Verification code has expired. Please request a new one." };
    }
    
    // Verify the OTP
    if (otpData.otp === enteredOTP) {
      // Mark as verified in the database
      await setDoc(otpRef, { ...otpData, verified: true }, { merge: true });
      
      // Update user profile to mark email as verified
      // This would be done by updating the user profile in the auth context
      
      return { success: true };
    } else {
      return { success: false, message: "Invalid verification code. Please try again." };
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Failed to verify OTP" 
    };
  }
};

// Function to check if user has a valid OTP verification
export const checkOTPVerification = async (uid: string): Promise<boolean> => {
  try {
    const otpRef = doc(otpCollection, uid);
    const otpDoc = await getDoc(otpRef);
    
    if (!otpDoc.exists()) {
      return false;
    }
    
    const otpData = otpDoc.data() as OTPData;
    return otpData.verified === true;
  } catch (error) {
    console.error("Error checking OTP verification:", error);
    return false;
  }
};
