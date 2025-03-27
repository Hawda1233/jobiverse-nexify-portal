
import { db } from "./firebase";
import { collection, addDoc, getDocs, query, where, orderBy, Timestamp, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { JobType } from "./jobsData";

// Collection reference
const jobsCollection = collection(db, "jobs");
const applicationsCollection = collection(db, "applications");

// Add a new job to Firestore
export const addJobToFirestore = async (jobData: Omit<JobType, "id">) => {
  try {
    const docRef = await addDoc(jobsCollection, {
      ...jobData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      active: true,
    });
    
    return { id: docRef.id, ...jobData };
  } catch (error) {
    console.error("Error adding job:", error);
    throw error;
  }
};

// Get all jobs from Firestore
export const getJobsFromFirestore = async () => {
  try {
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
  } catch (error) {
    console.error("Error getting jobs:", error);
    throw error;
  }
};

// Get jobs posted by specific HR user
export const getJobsByHR = async (userId: string) => {
  try {
    const q = query(jobsCollection, where("postedBy", "==", userId), orderBy("createdAt", "desc"));
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
  } catch (error) {
    console.error("Error getting HR jobs:", error);
    throw error;
  }
};

// Apply for a job
export const applyForJob = async (jobId: string, userId: string, applicationData: any) => {
  try {
    const docRef = await addDoc(applicationsCollection, {
      jobId,
      userId,
      ...applicationData,
      status: "pending",
      appliedAt: Timestamp.now(),
    });
    
    return docRef.id;
  } catch (error) {
    console.error("Error applying for job:", error);
    throw error;
  }
};

// Get applications for a specific job
export const getApplicationsForJob = async (jobId: string) => {
  try {
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

// Get applications submitted by a specific user
export const getUserApplications = async (userId: string) => {
  try {
    const q = query(applicationsCollection, where("userId", "==", userId), orderBy("appliedAt", "desc"));
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
    console.error("Error getting user applications:", error);
    throw error;
  }
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
