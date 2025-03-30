
import { db } from "./firebase";
import { collection, addDoc, getDocs, query, where, orderBy, Timestamp, doc, getDoc, updateDoc, deleteDoc, limit, DocumentData } from "firebase/firestore";
import { JobType } from "./jobsData";
import { getCandidateProfile } from "./profileOperations";
import { supabase, getJobsFromSupabase, addJobToSupabase, applyForJobInSupabase, getUserApplicationsFromSupabase } from "./supabase";

// Collection reference - ensure we're using the initialized Firestore instance
const getJobsCollection = () => collection(db, "jobs");
const getApplicationsCollection = () => collection(db, "applications");

// Add a new job to Firestore or Supabase
export const addJobToFirestore = async (jobData: Omit<JobType, "id" | "postedTime">) => {
  try {
    // Try to add to Supabase first
    try {
      const supabaseJob = await addJobToSupabase({
        title: jobData.title,
        company_name: jobData.companyName,
        location: jobData.location,
        job_type: jobData.jobType,
        salary: jobData.salary,
        category: jobData.category,
        description: jobData.description,
        experience_level: jobData.experienceLevel,
        featured: jobData.featured || false,
        posted_by: jobData.postedBy,
        keywords: generateJobKeywords(jobData) // Add keywords for better matching
      });
      
      // Format the posted time
      const postedTime = formatPostedTime(new Date());
      
      return { 
        id: String(supabaseJob.id || Math.floor(Math.random() * 10000)),
        ...jobData,
        postedTime 
      };
    } catch (supabaseError) {
      console.error("Error adding job to Supabase, falling back to Firebase:", supabaseError);
      
      // Fallback to Firebase - ensure we get a fresh collection reference
      const jobsCollection = getJobsCollection();
      const docRef = await addDoc(jobsCollection, {
        ...jobData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        active: true,
        keywords: generateJobKeywords(jobData), // Add keywords for better matching
      });
      
      // Format the posted time
      const postedTime = formatPostedTime(new Date());
      
      return { 
        id: docRef.id,
        ...jobData,
        postedTime 
      };
    }
  } catch (error) {
    console.error("Error adding job:", error);
    throw error;
  }
};

// Generate keywords from job data for better matching
const generateJobKeywords = (jobData: Omit<JobType, "id" | "postedTime">) => {
  const keywords = [];
  
  // Add job title terms
  keywords.push(...jobData.title.toLowerCase().split(/\s+/));
  
  // Add job category
  keywords.push(jobData.category.toLowerCase());
  
  // Add job description key terms (simplified approach)
  const descriptionTerms = jobData.description
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(term => term.length > 3 && !['and', 'the', 'for', 'with'].includes(term));
  
  keywords.push(...descriptionTerms);
  
  // Add job type
  keywords.push(jobData.jobType.toLowerCase());
  
  // Add experience level
  if (jobData.experienceLevel) {
    keywords.push(jobData.experienceLevel.toLowerCase());
  }
  
  // Return unique keywords
  return [...new Set(keywords)];
};

// Get all jobs from Firestore or Supabase
export const getJobsFromFirestore = async () => {
  try {
    // Try to get jobs from Supabase first
    try {
      const supabaseJobs = await getJobsFromSupabase();
      
      return supabaseJobs.map(job => ({
        id: String(job.id || Math.floor(Math.random() * 10000)),
        title: job.title,
        companyName: job.company_name,
        location: job.location,
        jobType: job.job_type,
        salary: job.salary,
        category: job.category,
        description: job.description,
        postedTime: formatPostedTime(new Date(job.created_at)),
        experienceLevel: job.experience_level,
        featured: job.featured,
        postedBy: job.posted_by,
      }));
    } catch (supabaseError) {
      console.error("Error getting jobs from Supabase, falling back to Firebase:", supabaseError);
      
      // Fallback to Firebase - ensure we get a fresh collection reference
      const jobsCollection = getJobsCollection();
      const q = query(jobsCollection, where("active", "==", true), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      
      const jobs: JobType[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        jobs.push({
          id: doc.id,
          title: data.title,
          companyName: data.companyName,
          location: data.location,
          jobType: data.jobType,
          salary: data.salary,
          category: data.category,
          description: data.description,
          postedTime: formatPostedTime(data.createdAt.toDate()),
          experienceLevel: data.experienceLevel,
          featured: data.featured,
          postedBy: data.postedBy,
        });
      });
      
      return jobs;
    }
  } catch (error) {
    console.error("Error getting jobs:", error);
    throw error;
  }
};

// Get jobs posted by specific HR user
export const getJobsByHR = async (userId: string) => {
  try {
    const jobsCollection = getJobsCollection();
    const q = query(jobsCollection, where("postedBy", "==", userId), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    const jobs: JobType[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      jobs.push({
        id: String(doc.id), // Convert to string to match JobType
        title: data.title,
        companyName: data.companyName,
        location: data.location,
        jobType: data.jobType,
        salary: data.salary,
        category: data.category,
        description: data.description,
        postedTime: formatPostedTime(data.createdAt.toDate()),
        experienceLevel: data.experienceLevel,
        featured: data.featured,
        postedBy: data.postedBy,
      });
    });
    
    return jobs;
  } catch (error) {
    console.error("Error getting HR jobs:", error);
    throw error;
  }
};

// Apply for a job in Firestore or Supabase
export const applyForJob = async (jobId: string, userId: string, applicationData: any) => {
  try {
    // Try to apply using Supabase first
    try {
      const supabaseApplication = await applyForJobInSupabase(jobId, userId, {
        name: applicationData.name,
        email: applicationData.email,
        phone_number: applicationData.phoneNumber,
        cover_letter: applicationData.coverLetter,
        resume: applicationData.resume,
        job_title: applicationData.jobTitle,
        company_name: applicationData.companyName,
        location: applicationData.location || "",
      });
      
      return supabaseApplication.id;
    } catch (supabaseError) {
      console.error("Error applying for job in Supabase, falling back to Firebase:", supabaseError);
      
      // Fallback to Firebase - ensure we get a fresh collection reference
      const applicationsCollection = getApplicationsCollection();
      const docRef = await addDoc(applicationsCollection, {
        jobId,
        userId,
        ...applicationData,
        status: "applied",
        appliedAt: Timestamp.now(),
      });
      
      return docRef.id;
    }
  } catch (error) {
    console.error("Error applying for job:", error);
    throw error;
  }
};

// Get applications for a specific job
export const getApplicationsForJob = async (jobId: string) => {
  try {
    const applicationsCollection = getApplicationsCollection();
    const q = query(applicationsCollection, where("jobId", "==", jobId), orderBy("appliedAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    const applications: any[] = [];
    querySnapshot.forEach((doc) => {
      applications.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    
    return applications;
  } catch (error) {
    console.error("Error getting applications:", error);
    throw error;
  }
};

// Define type for application data
interface ApplicationData {
  id: string | number;
  job_id?: string;
  jobId?: string;
  jobTitle?: string;
  jobs?: {
    title: string;
    company_name: string;
    location?: string;
  };
  job_title?: string;
  companyName?: string;
  company_name?: string;
  location?: string;
  status: string;
  appliedAt?: any;
  applied_at?: string;
  [key: string]: any;
}

// Get applications submitted by a specific user from Firestore or Supabase
export const getUserApplications = async (userId: string) => {
  try {
    // Try to get applications from Supabase first
    try {
      const supabaseApplications = await getUserApplicationsFromSupabase(userId);
      
      return supabaseApplications.map((application: ApplicationData) => ({
        id: application.id,
        jobId: application.job_id,
        jobTitle: application.jobs?.title,
        companyName: application.jobs?.company_name,
        location: application.jobs?.location || "",
        status: application.status,
        appliedDate: new Date(application.applied_at || Date.now()),
        // Only spread known properties, not the entire unknown object
        phoneNumber: application.phone_number,
        resume: application.resume,
        coverLetter: application.cover_letter
      }));
    } catch (supabaseError) {
      console.error("Error getting user applications from Supabase, falling back to Firebase:", supabaseError);
      
      // Fallback to Firebase
      const applicationsCollection = getApplicationsCollection();
      const q = query(applicationsCollection, where("userId", "==", userId), orderBy("appliedAt", "desc"));
      const querySnapshot = await getDocs(q);
      
      const applications: any[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        applications.push({
          id: doc.id,
          jobId: data.jobId,
          jobTitle: data.jobTitle,
          companyName: data.companyName,
          location: data.location || "",
          status: data.status,
          appliedDate: data.appliedAt.toDate(),
          // Only include specific properties we know exist
          phoneNumber: data.phoneNumber,
          resume: data.resume,
          coverLetter: data.coverLetter
        });
      });
      
      return applications;
    }
  } catch (error) {
    console.error("Error getting user applications:", error);
    throw error;
  }
};

// Update application status
export const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
  try {
    const applicationRef = doc(db, "applications", applicationId);
    await updateDoc(applicationRef, {
      status: newStatus,
      updatedAt: Timestamp.now(),
    });
    return true;
  } catch (error) {
    console.error("Error updating application status:", error);
    throw error;
  }
};

// Delete an application
export const deleteApplication = async (applicationId: string) => {
  try {
    const applicationRef = doc(db, "applications", applicationId);
    await deleteDoc(applicationRef);
    return true;
  } catch (error) {
    console.error("Error deleting application:", error);
    throw error;
  }
};

// Get personalized job recommendations for a candidate
export const getPersonalizedJobs = async (userId: string) => {
  try {
    // Get the candidate's profile to extract skills and preferences
    const candidateProfile = await getCandidateProfile(userId);
    
    if (!candidateProfile || !candidateProfile.skills || candidateProfile.skills.length === 0) {
      // If no profile or skills, return general active jobs
      return getJobsFromFirestore();
    }
    
    // Extract candidate skills for matching
    const candidateSkills = candidateProfile.skills.map(skill => skill.toLowerCase());
    
    // Get all active jobs
    const jobsCollection = getJobsCollection();
    const q = query(jobsCollection, where("active", "==", true), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    const jobs: JobType[] = [];
    const jobsWithScores: { job: JobType, score: number }[] = [];
    
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      const job: JobType = {
        id: String(docSnapshot.id), // Convert to string to match JobType
        title: data.title,
        companyName: data.companyName,
        location: data.location,
        jobType: data.jobType,
        salary: data.salary,
        category: data.category,
        description: data.description,
        postedTime: formatPostedTime(data.createdAt.toDate()),
        experienceLevel: data.experienceLevel,
        featured: data.featured,
        postedBy: data.postedBy,
      };
      
      // Calculate match score based on skills relevance
      const matchScore = calculateJobMatchScore(job, candidateSkills, data.keywords || []);
      
      jobsWithScores.push({ job, score: matchScore });
    });
    
    // Sort jobs by match score (higher first)
    jobsWithScores.sort((a, b) => b.score - a.score);
    
    // Return sorted jobs
    return jobsWithScores.map(item => item.job);
  } catch (error) {
    console.error("Error getting personalized jobs:", error);
    throw error;
  }
};

// Calculate job match score based on candidate skills and job keywords
const calculateJobMatchScore = (job: JobType, candidateSkills: string[], jobKeywords: string[]) => {
  let score = 0;
  
  // Check job title for skill mentions (highest weight)
  candidateSkills.forEach(skill => {
    if (job.title.toLowerCase().includes(skill)) {
      score += 10;
    }
  });
  
  // Check job description for skill mentions
  candidateSkills.forEach(skill => {
    if (job.description.toLowerCase().includes(skill)) {
      score += 5;
    }
  });
  
  // Check job keywords for matches with candidate skills
  candidateSkills.forEach(skill => {
    if (jobKeywords.includes(skill)) {
      score += 8;
    }
  });
  
  // Bonus score for featured jobs
  if (job.featured) {
    score += 3;
  }
  
  // Recency bonus (within last 3 days)
  const postedDaysAgo = job.postedTime.includes('day') ? 
    parseInt(job.postedTime.split(' ')[0]) : 
    (job.postedTime.includes('hour') || job.postedTime.includes('minute') || job.postedTime === 'Just now') ? 0 : 30;
  
  if (postedDaysAgo <= 3) {
    score += 2;
  }
  
  return score;
};

// Helper function to format the posted time
const formatPostedTime = (date: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 60) {
    return diffInMinutes <= 1 ? "Just now" : `${diffInMinutes} minutes ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
  } else if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
  } else {
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  }
};
