
import { supabase } from './supabase';
import { JobType } from './jobsData';
import { UserData } from '@/contexts/AuthContext';

// Function to sync Firebase user with Supabase user
export const syncUserWithSupabase = async (firebaseUser: any) => {
  if (!firebaseUser) return null;
  
  try {
    // Check if users table exists before making request
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('firebase_uid', firebaseUser.uid)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error checking user in Supabase:', error);
        return null;
      }
      
      if (!data) {
        // Create new user in Supabase if they don't exist
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert([
            { 
              firebase_uid: firebaseUser.uid, 
              email: firebaseUser.email,
              display_name: firebaseUser.displayName || '',
              role: 'candidate',
              created_at: new Date(),
              updated_at: new Date()
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
    } catch (tableError) {
      console.error('Users table may not exist in Supabase:', tableError);
      return null;
    }
  } catch (error) {
    console.error('Error in syncUserWithSupabase:', error);
    return null;
  }
};

// Update user role in Supabase
export const updateUserRoleInSupabase = async (
  firebaseUid: string, 
  role: "candidate" | "hr",
  data?: { company?: string, industry?: string }
) => {
  try {
    const updateData: any = {
      role,
      updated_at: new Date()
    };
    
    if (data?.company) updateData.company = data.company;
    if (data?.industry) updateData.industry = data.industry;
    
    const { error } = await supabase
      .from('users')
      .update(updateData)
      .eq('firebase_uid', firebaseUid);
    
    if (error) {
      console.error('Error updating user role in Supabase:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateUserRoleInSupabase:', error);
    return false;
  }
};

// Function to add a job to Supabase with proper error handling
export const addJob = async (jobData: any) => {
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
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in addJob:', error);
    throw error;
  }
};

// Function to get jobs from Supabase with proper error handling
export const getJobs = async (options?: {
  filter?: string;
  category?: string;
  location?: string;
  featured?: boolean;
  limit?: number;
  userId?: string;
}) => {
  try {
    let query = supabase
      .from('jobs')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false });
    
    if (options?.featured) {
      query = query.eq('featured', true);
    }
    
    if (options?.userId) {
      query = query.eq('posted_by', options.userId);
    }
    
    if (options?.category && options.category !== 'All Categories') {
      query = query.ilike('category', `%${options.category}%`);
    }
    
    if (options?.location) {
      query = query.ilike('location', `%${options.location}%`);
    }
    
    if (options?.filter) {
      query = query.or(`title.ilike.%${options.filter}%,description.ilike.%${options.filter}%,company_name.ilike.%${options.filter}%`);
    }
    
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching jobs from Supabase:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getJobs:', error);
    throw error;
  }
};

// Function to get a single job by ID
export const getJobById = async (jobId: string) => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();
    
    if (error) {
      console.error('Error fetching job from Supabase:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getJobById:', error);
    throw error;
  }
};

// Function to apply for a job
export const applyForJob = async (jobId: string, userId: string, applicationData: any) => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .insert([{
        job_id: jobId,
        user_id: userId,
        ...applicationData,
        status: 'applied',
        applied_at: new Date(),
        updated_at: new Date()
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error applying for job in Supabase:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in applyForJob:', error);
    throw error;
  }
};

// Function to get user applications with job details
export const getUserApplications = async (userId: string) => {
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
    console.error('Error in getUserApplications:', error);
    throw error;
  }
};

// Format Supabase job data to match our JobType interface
export const formatJobData = (job: any): JobType => {
  return {
    id: job.id || `temp-${Date.now()}`,
    title: job.title || 'Untitled Position',
    companyName: job.company_name || 'Unknown Company',
    location: job.location || 'Remote',
    jobType: job.job_type || 'Full-time',
    salary: job.salary || 'Competitive',
    category: job.category || 'Technology',
    description: job.description || 'No description provided',
    experienceLevel: job.experience_level || 'Entry Level',
    featured: job.featured || false,
    postedBy: job.posted_by || 'Unknown',
    postedTime: formatPostedDate(job.created_at) || 'Recently',
    companyLogo: "/placeholder.svg" // Default logo
  };
};

// Format posted date from Supabase timestamp to relative time
const formatPostedDate = (timestamp: string): string => {
  if (!timestamp) return 'Recently';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return "Today";
  } else if (diffInDays === 1) {
    return "Yesterday";
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else {
    const months = Math.floor(diffInDays / 30);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  }
};
