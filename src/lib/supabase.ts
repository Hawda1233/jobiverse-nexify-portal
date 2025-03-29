import { createClient } from '@supabase/supabase-js';

// Supabase connection details
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cgciiicdtfmukdlvpkyv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnY2lpaWNkdGZtdWtkbHZwa3l2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyNzcxNDYsImV4cCI6MjA1ODg1MzE0Nn0.PpMD2j6Se50QpnlN3JnV3vOj3P2LCrrlxNpqOmIPl7w';

// Create Supabase client with error handling
let supabase;
try {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
  console.log('Supabase client initialized successfully');
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  // Create a fallback client with default values
  supabase = createClient(
    'https://cgciiicdtfmukdlvpkyv.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnY2lpaWNkdGZtdWtkbHZwa3l2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyNzcxNDYsImV4cCI6MjA1ODg1MzE0Nn0.PpMD2j6Se50QpnlN3JnV3vOj3P2LCrrlxNpqOmIPl7w',
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    }
  );
}

export { supabase };

// Helper functions for Supabase operations

// Function to sync Firebase user with Supabase
export const syncUserWithSupabase = async (firebaseUid: string, email: string) => {
  try {
    // Check if user exists in Supabase
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('firebase_uid', firebaseUid)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
      console.error('Error checking user in Supabase:', error);
      return null;
    }
    
    if (!data) {
      // Create new user in Supabase if they don't exist
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([
          { 
            firebase_uid: firebaseUid, 
            email: email,
            created_at: new Date()
          }
        ])
        .select()
        .single();
      
      if (insertError) {
        console.error('Error creating user in Supabase:', insertError);
        return null;
      }
      
      return newUser;
    }
    
    return data;
  } catch (error) {
    console.error('Error in syncUserWithSupabase:', error);
    return null;
  }
};

// Function to get user data from Supabase
export const getUserFromSupabase = async (firebaseUid: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('firebase_uid', firebaseUid)
      .single();
    
    if (error) {
      console.error('Error fetching user from Supabase:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getUserFromSupabase:', error);
    return null;
  }
};

// Job-related functions

// Function to fetch jobs from Supabase
export const getJobsFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching jobs from Supabase:', error);
      return []; // Return empty array instead of throwing error
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getJobsFromSupabase:', error);
    return []; // Return empty array instead of throwing error
  }
};

// Function to add a job to Supabase
export const addJobToSupabase = async (jobData: any) => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .insert([{
        ...jobData,
        created_at: new Date(),
        updated_at: new Date(),
        active: true
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding job to Supabase:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in addJobToSupabase:', error);
    return null;
  }
};

// Application-related functions

// Function to apply for a job in Supabase
export const applyForJobInSupabase = async (jobId: string, userId: string, applicationData: any) => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .insert([{
        job_id: jobId,
        user_id: userId,
        ...applicationData,
        status: 'applied',
        applied_at: new Date()
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error applying for job in Supabase:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in applyForJobInSupabase:', error);
    throw error;
  }
};

// Function to get user applications from Supabase
export const getUserApplicationsFromSupabase = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        jobs:job_id (*)
      `)
      .eq('user_id', userId)
      .order('applied_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching user applications from Supabase:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getUserApplicationsFromSupabase:', error);
    throw error;
  }
};

// OTP-related functions

// Function to store OTP in Supabase
export const storeOTPInSupabase = async (uid: string, email: string, otp: string, expiresAt: Date) => {
  try {
    const { error } = await supabase
      .from('otp_verifications')
      .upsert([{
        uid,
        email,
        otp,
        created_at: new Date(),
        expires_at: expiresAt,
        verified: false
      }], {
        onConflict: 'uid'
      });
    
    if (error) {
      console.error('Error storing OTP in Supabase:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in storeOTPInSupabase:', error);
    return false;
  }
};

// Function to verify OTP in Supabase
export const verifyOTPInSupabase = async (uid: string, enteredOTP: string) => {
  try {
    // Get the OTP record
    const { data, error } = await supabase
      .from('otp_verifications')
      .select('*')
      .eq('uid', uid)
      .single();
    
    if (error) {
      console.error('Error fetching OTP from Supabase:', error);
      return { success: false, message: 'Failed to verify OTP' };
    }
    
    if (!data) {
      return { success: false, message: 'No verification code found. Please request a new one.' };
    }
    
    // Check if OTP has expired
    const now = new Date();
    const expiryDate = new Date(data.expires_at);
    
    if (now > expiryDate) {
      return { success: false, message: 'Verification code has expired. Please request a new one.' };
    }
    
    // Verify the OTP
    if (data.otp === enteredOTP) {
      // Mark as verified
      const { error: updateError } = await supabase
        .from('otp_verifications')
        .update({ verified: true })
        .eq('uid', uid);
      
      if (updateError) {
        console.error('Error updating OTP verification status:', updateError);
      }
      
      return { success: true };
    } else {
      return { success: false, message: 'Invalid verification code. Please try again.' };
    }
  } catch (error) {
    console.error('Error in verifyOTPInSupabase:', error);
    return { success: false, message: 'Failed to verify OTP' };
  }
};
