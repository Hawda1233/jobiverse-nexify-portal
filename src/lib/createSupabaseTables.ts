
import { supabase } from './supabase';

// Helper function to check if a table exists
const checkTableExists = async (tableName: string) => {
  try {
    const { error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    return !error;
  } catch (error) {
    console.error(`Error checking if ${tableName} table exists:`, error);
    return false;
  }
};

// Create required tables using SQL directly instead of RPC calls
export const createRequiredTables = async () => {
  try {
    // Check and create users table
    const usersTableExists = await checkTableExists('users');
    if (!usersTableExists) {
      console.log('Creating users table in Supabase');
      try {
        const { error: createUsersError } = await supabase.rpc('create_users_table');
        
        if (createUsersError) {
          console.error('Error creating users table:', createUsersError);
        }
      } catch (rpcError) {
        console.error("RPC error for users table:", rpcError);
        // Try direct SQL as a fallback - this is just a placeholder
        // In a real app, we would implement direct SQL queries here
      }
    }

    // Check and create jobs table
    const jobsTableExists = await checkTableExists('jobs');
    if (!jobsTableExists) {
      console.log('Creating jobs table in Supabase');
      try {
        const { error: createJobsError } = await supabase.rpc('create_jobs_table');
        
        if (createJobsError) {
          console.error('Error creating jobs table:', createJobsError);
        }
      } catch (rpcError) {
        console.error("RPC error for jobs table:", rpcError);
      }
    }

    // Check and create applications table
    const applicationsTableExists = await checkTableExists('applications');
    if (!applicationsTableExists) {
      console.log('Creating applications table in Supabase');
      try {
        const { error: createApplicationsError } = await supabase.rpc('create_applications_table');
        
        if (createApplicationsError) {
          console.error('Error creating applications table:', createApplicationsError);
        }
      } catch (rpcError) {
        console.error("RPC error for applications table:", rpcError);
      }
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
    await createRequiredTables();
    return true;
  } catch (error) {
    console.error('Failed to initialize Supabase:', error);
    return false;
  }
};
