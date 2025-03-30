
import { db } from "./firebase";
import { collection, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

// Collection references - initialize with db reference directly
const employerProfilesCollection = () => collection(db, "employerProfiles");
const candidateProfilesCollection = () => collection(db, "candidateProfiles");

// Interface for employer profile data
export interface EmployerProfileData {
  uid: string;
  fullName: string;
  email: string;
  company: string;
  industry: string;
  position?: string;
  phone?: string;
  website?: string;
  description?: string;
  location?: string;
  companySize?: string;
  foundedYear?: number;
  logo?: string;
  emailVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Create or update employer profile
export const saveEmployerProfile = async (profileData: Omit<EmployerProfileData, "createdAt" | "updatedAt">) => {
  try {
    const profileRef = doc(db, "employerProfiles", profileData.uid);
    const docSnap = await getDoc(profileRef);
    
    if (docSnap.exists()) {
      // Update existing profile
      await updateDoc(profileRef, {
        ...profileData,
        updatedAt: new Date()
      });
    } else {
      // Create new profile
      await setDoc(profileRef, {
        ...profileData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error saving employer profile:", error);
    throw error;
  }
};

// Get employer profile by user ID
export const getEmployerProfile = async (uid: string) => {
  try {
    const profileRef = doc(db, "employerProfiles", uid);
    const docSnap = await getDoc(profileRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      // Make sure all required fields are present in the returned data
      return {
        uid, // Use the provided uid to ensure this field is always set
        fullName: data.fullName || "",
        email: data.email || "",
        company: data.company || "",
        industry: data.industry || "",
        position: data.position,
        phone: data.phone,
        website: data.website,
        description: data.description,
        location: data.location,
        companySize: data.companySize,
        foundedYear: data.foundedYear,
        logo: data.logo,
        emailVerified: data.emailVerified,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      } as EmployerProfileData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting employer profile:", error);
    throw error;
  }
};

// Interface for candidate profile data
export interface CandidateProfileData {
  uid: string;
  fullName?: string;
  email: string;
  skills?: string[];
  experience?: string;
  education?: string;
  resume?: string;
  phone?: string;
  location?: string;
  bio?: string;
  portfolio?: string;
  linkedIn?: string;
  github?: string;
  preferredJobTypes?: string[];
  preferredLocations?: string[];
  preferredCategories?: string[]; 
  emailVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Create or update candidate profile
export const saveCandidateProfile = async (profileData: Omit<CandidateProfileData, "createdAt" | "updatedAt">) => {
  try {
    const profileRef = doc(db, "candidateProfiles", profileData.uid);
    const docSnap = await getDoc(profileRef);
    
    if (docSnap.exists()) {
      // Update existing profile
      await updateDoc(profileRef, {
        ...profileData,
        updatedAt: new Date()
      });
    } else {
      // Create new profile
      await setDoc(profileRef, {
        ...profileData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error saving candidate profile:", error);
    throw error;
  }
};

// Get candidate profile by user ID
export const getCandidateProfile = async (uid: string) => {
  try {
    const profileRef = doc(db, "candidateProfiles", uid);
    const docSnap = await getDoc(profileRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      // Make sure all required fields are present in the returned data
      return {
        uid, // Use the provided uid to ensure this field is always set
        email: data.email || "",
        fullName: data.fullName,
        skills: data.skills || [],
        experience: data.experience,
        education: data.education,
        resume: data.resume,
        phone: data.phone,
        location: data.location,
        bio: data.bio,
        portfolio: data.portfolio,
        linkedIn: data.linkedIn,
        github: data.github,
        preferredJobTypes: data.preferredJobTypes || [],
        preferredLocations: data.preferredLocations || [],
        preferredCategories: data.preferredCategories || [],
        emailVerified: data.emailVerified,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      } as CandidateProfileData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting candidate profile:", error);
    throw error;
  }
};
