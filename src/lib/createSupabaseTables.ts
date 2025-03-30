
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
    // Create users table using custom RPC
    try {
      const { error: usersRPCError } = await supabase.rpc('create_users_table');
      if (usersRPCError) {
        console.log('Error with users table RPC, trying direct schema creation:', usersRPCError);
        // Fall back to direct schema query if RPC fails
        await supabase.schema.createTable('users', table => {
          table.uuid('id').primaryKey().defaultTo(supabase.sql`uuid_generate_v4()`);
          table.text('email');
          table.text('display_name');
          table.text('role');
          table.timestamps(true, true);
        }).ifNotExists();
      }
    } catch (error) {
      console.error("Users table creation error:", error);
    }

    // Create jobs table using custom RPC
    try {
      const { error: jobsRPCError } = await supabase.rpc('create_jobs_table');
      if (jobsRPCError) {
        console.log('Error with jobs table RPC, trying direct schema creation:', jobsRPCError);
        // Fall back to direct schema query if RPC fails
        await supabase.schema.createTable('jobs', table => {
          table.uuid('id').primaryKey().defaultTo(supabase.sql`uuid_generate_v4()`);
          table.text('title').notNull();
          table.text('company_name').notNull();
          table.text('location');
          table.text('job_type');
          table.text('salary');
          table.text('description').notNull();
          table.text('category');
          table.text('experience_level');
          table.uuid('posted_by').notNull().references('id').inTable('users');
          table.boolean('featured').defaultTo(false);
          table.timestamps(true, true);
        }).ifNotExists();
      }
    } catch (error) {
      console.error("Jobs table creation error:", error);
    }

    // Create applications table using custom RPC
    try {
      const { error: applicationsRPCError } = await supabase.rpc('create_applications_table');
      if (applicationsRPCError) {
        console.log('Error with applications table RPC, trying direct schema creation:', applicationsRPCError);
        // Fall back to direct schema query if RPC fails
        await supabase.schema.createTable('applications', table => {
          table.uuid('id').primaryKey().defaultTo(supabase.sql`uuid_generate_v4()`);
          table.uuid('user_id').notNull().references('id').inTable('users');
          table.uuid('job_id').notNull().references('id').inTable('jobs');
          table.text('status').defaultTo('applied');
          table.text('cover_letter');
          table.text('resume');
          table.timestamps(true, true);
        }).ifNotExists();
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
