
import { User } from "firebase/auth";
import { sendEmailVerificationWithOTP } from "./emailService";
import { supabase, storeOTPInSupabase, verifyOTPInSupabase } from "./supabase";

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
    
    // Store OTP in Supabase with expiry
    await storeOTPInSupabase(user.uid, user.email || "", otp, expiresAt);
    
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
    // Verify OTP using Supabase
    return await verifyOTPInSupabase(uid, enteredOTP);
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
    const { data, error } = await supabase
      .from('otp_verifications')
      .select('verified')
      .eq('uid', uid)
      .single();
    
    if (error || !data) {
      return false;
    }
    
    return data.verified === true;
  } catch (error) {
    console.error("Error checking OTP verification:", error);
    return false;
  }
};
