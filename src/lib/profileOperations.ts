
import { db } from "./firebase";
import { collection, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

// Collection references
const employerProfilesCollection = collection(db, "employerProfiles");
const candidateProfilesCollection = collection(db, "candidateProfiles");

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
  createdAt: Date;
  updatedAt: Date;
}

// Create or update employer profile
export const saveEmployerProfile = async (profileData: Omit<EmployerProfileData, "createdAt" | "updatedAt">) => {
  try {
    const profileRef = doc(employerProfilesCollection, profileData.uid);
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
    const profileRef = doc(employerProfilesCollection, uid);
    const docSnap = await getDoc(profileRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as EmployerProfileData;
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
  createdAt: Date;
  updatedAt: Date;
}

// Create or update candidate profile
export const saveCandidateProfile = async (profileData: Omit<CandidateProfileData, "createdAt" | "updatedAt">) => {
  try {
    const profileRef = doc(candidateProfilesCollection, profileData.uid);
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
    const profileRef = doc(candidateProfilesCollection, uid);
    const docSnap = await getDoc(profileRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as CandidateProfileData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting candidate profile:", error);
    throw error;
  }
};
