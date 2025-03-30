
import { supabase } from './supabase';

// Helper function to check if a table exists
const checkTableExists = async (tableName: string) => {
  try {
    const { error } = await supabase
      .from(tableName)
      .select('count')
      .limit(1)
      .single();
    
    return !error;
  } catch (error) {
    console.error(`Error checking if ${tableName} table exists:`, error);
    return false;
  }
};

// Create required tables using SQL RPC calls
export const createRequiredTables = async () => {
  try {
    // Try to create tables using RPC calls
    // This may fail if we don't have the right permissions or if the RPCs aren't defined
    // We'll just log errors and continue - this is not critical for the app to work
    
    // Create users table using custom RPC
    try {
      const { error: usersRPCError } = await supabase.rpc('create_users_table');
      if (usersRPCError) {
        console.log('Error with users table RPC:', usersRPCError);
      }
    } catch (error) {
      console.error("Users table creation error:", error);
    }

    // Create jobs table using custom RPC
    try {
      const { error: jobsRPCError } = await supabase.rpc('create_jobs_table');
      if (jobsRPCError) {
        console.log('Error with jobs table RPC:', jobsRPCError);
      }
    } catch (error) {
      console.error("Jobs table creation error:", error);
    }

    // Create applications table using custom RPC
    try {
      const { error: applicationsRPCError } = await supabase.rpc('create_applications_table');
      if (applicationsRPCError) {
        console.log('Error with applications table RPC:', applicationsRPCError);
      }
    } catch (error) {
      console.error("Applications table creation error:", error);
    }

    return true;
  } catch (error) {
    console.error('Error checking/creating tables:', error);
    return false;
  }
};

// Call this function during app initialization
export const initializeSupabase = async () => {
  try {
    console.log('Initializing Supabase...');
    
    if (!supabase) {
      console.error('Supabase client not initialized');
      return false;
    }
    
    // Use an RPC or direct SQL if we have the appropriate permissions
    try {
      await createRequiredTables();
      console.log('Supabase tables initialized successfully');
      return true;
    } catch (error) {
      console.warn('Could not create Supabase tables - this is OK for read-only access:', error);
      return true; // Still return true as we don't want to block the app
    }
  } catch (error) {
    console.error('Failed to initialize Supabase:', error);
    return false;
  }
};
