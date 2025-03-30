
import { supabase } from './supabase';

export const createRequiredTables = async () => {
  try {
    // Check if users table exists
    const { error: userTableExistsError } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    // Create users table if it doesn't exist
    if (userTableExistsError && userTableExistsError.message.includes('does not exist')) {
      console.log('Creating users table in Supabase');
      const { error: createUserTableError } = await supabase.rpc('create_users_table');
      if (createUserTableError) {
        console.error('Error creating users table:', createUserTableError);
      }
    }

    // Check if jobs table exists
    const { error: jobsTableExistsError } = await supabase
      .from('jobs')
      .select('id')
      .limit(1);

    // Create jobs table if it doesn't exist
    if (jobsTableExistsError && jobsTableExistsError.message.includes('does not exist')) {
      console.log('Creating jobs table in Supabase');
      const { error: createJobsTableError } = await supabase.rpc('create_jobs_table');
      if (createJobsTableError) {
        console.error('Error creating jobs table:', createJobsTableError);
      }
    }

    // Check if applications table exists
    const { error: applicationsTableExistsError } = await supabase
      .from('applications')
      .select('id')
      .limit(1);

    // Create applications table if it doesn't exist
    if (applicationsTableExistsError && applicationsTableExistsError.message.includes('does not exist')) {
      console.log('Creating applications table in Supabase');
      const { error: createApplicationsTableError } = await supabase.rpc('create_applications_table');
      if (createApplicationsTableError) {
        console.error('Error creating applications table:', createApplicationsTableError);
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
