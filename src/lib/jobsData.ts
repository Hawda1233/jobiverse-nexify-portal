
export const categories = [
  {
    id: "1",
    name: "Technology",
    description: "Software Development, Data Science, IT, etc.",
    jobCount: 254
  },
  {
    id: "2",
    name: "Marketing",
    description: "Digital Marketing, Content Creation, SEO, etc.",
    jobCount: 178
  },
  {
    id: "3",
    name: "Sales",
    description: "Business Development, Account Management, etc.",
    jobCount: 142
  },
  {
    id: "4",
    name: "Finance",
    description: "Accounting, Investment Banking, Financial Analysis, etc.",
    jobCount: 119
  },
  {
    id: "5",
    name: "Human Resources",
    description: "Recruiting, Employee Relations, Training, etc.",
    jobCount: 87
  },
  {
    id: "6",
    name: "Healthcare",
    description: "Nursing, Medicine, Pharmaceuticals, etc.",
    jobCount: 203
  },
  {
    id: "7",
    name: "Education",
    description: "Teaching, Administration, Research, etc.",
    jobCount: 95
  },
  {
    id: "8",
    name: "Design",
    description: "Graphic Design, UX/UI Design, Product Design, etc.",
    jobCount: 76
  },
  {
    id: "9",
    name: "Engineering",
    description: "Civil, Mechanical, Electrical, etc.",
    jobCount: 164
  },
  {
    id: "10",
    name: "Customer Service",
    description: "Support, Call Center, Client Relations, etc.",
    jobCount: 132
  },
];

// Updated JobType to match Supabase structure
export interface JobType {
  id: string;
  title: string;
  companyName: string;
  companyLogo?: string;
  location: string;
  jobType: string;
  salary?: string;
  category: string;
  description: string;
  experienceLevel: string;
  featured?: boolean;
  postedBy: string;
  postedTime: string;
}

// Sample jobs data for development
export const sampleJobs: JobType[] = [
  {
    id: "1",
    title: "Senior Front-end Developer",
    companyName: "Tech Solutions Inc.",
    companyLogo: "/logos/microsoft.svg",
    location: "San Francisco, CA",
    jobType: "Full-time",
    salary: "$120,000 - $150,000",
    category: "Technology",
    description: "We are looking for an experienced Front-end Developer to join our team. The ideal candidate should have strong skills in React, TypeScript, and modern CSS frameworks.",
    experienceLevel: "Senior",
    featured: true,
    postedBy: "hr_user_1",
    postedTime: "2 days ago"
  },
  {
    id: "2",
    title: "Marketing Manager",
    companyName: "Global Brands Ltd.",
    companyLogo: "/logos/apple.svg",
    location: "New York, NY",
    jobType: "Full-time",
    salary: "$90,000 - $110,000",
    category: "Marketing",
    description: "We're seeking a Marketing Manager to develop and implement marketing strategies. The ideal candidate will have experience in digital marketing and brand management.",
    experienceLevel: "Mid-level",
    featured: false,
    postedBy: "hr_user_2",
    postedTime: "1 week ago"
  },
  {
    id: "3",
    title: "Data Scientist",
    companyName: "Analytics Pro",
    companyLogo: "/logos/google.svg",
    location: "Remote",
    jobType: "Contract",
    salary: "$100,000 - $130,000",
    category: "Technology",
    description: "Looking for a Data Scientist to help us analyze large datasets and build predictive models. Must be proficient in Python, SQL, and machine learning frameworks.",
    experienceLevel: "Mid-level",
    featured: true,
    postedBy: "hr_user_1",
    postedTime: "3 days ago"
  },
  {
    id: "4",
    title: "UX/UI Designer",
    companyName: "Creative Studios",
    companyLogo: "/logos/meta.svg",
    location: "Austin, TX",
    jobType: "Full-time",
    salary: "$85,000 - $105,000",
    category: "Design",
    description: "Join our design team to create beautiful and functional interfaces for web and mobile applications. Experience with Figma and Adobe Creative Suite required.",
    experienceLevel: "Junior",
    featured: false,
    postedBy: "hr_user_3",
    postedTime: "5 days ago"
  },
  {
    id: "5",
    title: "Financial Analyst",
    companyName: "Investment Partners",
    companyLogo: "/logos/amazon.svg",
    location: "Chicago, IL",
    jobType: "Full-time",
    salary: "$80,000 - $95,000",
    category: "Finance",
    description: "Seeking a Financial Analyst to support our investment decision-making process. Strong Excel skills and knowledge of financial modeling required.",
    experienceLevel: "Entry-level",
    featured: false,
    postedBy: "hr_user_2",
    postedTime: "2 weeks ago"
  }
];

// Function to get featured jobs for the homepage
export const getFeaturedJobs = (): JobType[] => {
  return sampleJobs.filter(job => job.featured === true);
};

// Function to get all jobs - used by CompanyJobs.tsx
export const allJobs = sampleJobs;
