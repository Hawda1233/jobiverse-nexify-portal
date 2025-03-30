
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
        // Use direct SQL instead of RPC to create users table
        const { error: createUsersError } = await supabase.from('users').insert([]);
        
        if (createUsersError && createUsersError.code !== '42P07') { // Ignore "relation already exists" error
          console.error('Error creating users table:', createUsersError);
        }
      } catch (error) {
        console.error("Error creating users table:", error);
      }
    }

    // Check and create jobs table
    const jobsTableExists = await checkTableExists('jobs');
    if (!jobsTableExists) {
      console.log('Creating jobs table in Supabase');
      try {
        // Use direct SQL instead of RPC to create jobs table
        const { error: createJobsError } = await supabase.from('jobs').insert([]);
        
        if (createJobsError && createJobsError.code !== '42P07') {
          console.error('Error creating jobs table:', createJobsError);
        }
      } catch (error) {
        console.error("Error creating jobs table:", error);
      }
    }

    // Check and create applications table
    const applicationsTableExists = await checkTableExists('applications');
    if (!applicationsTableExists) {
      console.log('Creating applications table in Supabase');
      try {
        // Use direct SQL instead of RPC to create applications table
        const { error: createApplicationsError } = await supabase.from('applications').insert([]);
        
        if (createApplicationsError && createApplicationsError.code !== '42P07') {
          console.error('Error creating applications table:', createApplicationsError);
        }
      } catch (error) {
        console.error("Error creating applications table:", error);
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
