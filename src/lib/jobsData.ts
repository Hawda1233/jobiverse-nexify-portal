export const categories = [
  {
    id: "1",
    name: "Technology",
    description: "Software Development, Data Science, IT, etc.",
  },
  {
    id: "2",
    name: "Marketing",
    description: "Digital Marketing, Content Creation, SEO, etc.",
  },
  {
    id: "3",
    name: "Sales",
    description: "Business Development, Account Management, etc.",
  },
  {
    id: "4",
    name: "Finance",
    description: "Accounting, Investment Banking, Financial Analysis, etc.",
  },
  {
    id: "5",
    name: "Human Resources",
    description: "Recruiting, Employee Relations, Training, etc.",
  },
  {
    id: "6",
    name: "Healthcare",
    description: "Nursing, Medicine, Pharmaceuticals, etc.",
  },
  {
    id: "7",
    name: "Education",
    description: "Teaching, Administration, Research, etc.",
  },
  {
    id: "8",
    name: "Design",
    description: "Graphic Design, UX/UI Design, Product Design, etc.",
  },
  {
    id: "9",
    name: "Engineering",
    description: "Civil, Mechanical, Electrical, etc.",
  },
  {
    id: "10",
    name: "Customer Service",
    description: "Support, Call Center, Client Relations, etc.",
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
