export interface JobType {
  id: number;
  title: string;
  companyName: string;
  companyLogo?: string;
  location: string;
  jobType: string;
  salary?: string;
  category: string;
  description: string;
  postedTime: string;
  experienceLevel: string;
  featured?: boolean;
  postedBy?: string;
}

export const initialJobs: JobType[] = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    companyName: "TechGlobe",
    location: "Bangalore, India",
    jobType: "Full-time",
    salary: "₹18L - ₹24L",
    category: "Technology",
    description: "We're looking for a Senior Frontend Developer to join our team and help build innovative web applications using React, TypeScript, and modern frontend tools.",
    postedTime: "2 days ago",
    experienceLevel: "Senior Level",
    featured: true
  },
  {
    id: 2,
    title: "UX/UI Designer",
    companyName: "DesignHub",
    location: "Mumbai, India",
    jobType: "Full-time",
    salary: "₹12L - ₹18L",
    category: "Design",
    description: "Join our creative team to design beautiful, intuitive interfaces for our clients across various industries. You'll work closely with product managers and developers to create exceptional user experiences.",
    postedTime: "1 week ago",
    experienceLevel: "Mid Level"
  },
  {
    id: 3,
    title: "Data Scientist",
    companyName: "DataMind",
    location: "Remote",
    jobType: "Full-time",
    salary: "₹20L - ₹30L",
    category: "Technology",
    description: "We're seeking a Data Scientist to help analyze complex datasets and develop machine learning models that drive business decisions and product improvements.",
    postedTime: "3 days ago",
    experienceLevel: "Senior Level",
    featured: true
  },
  {
    id: 4,
    title: "Marketing Manager",
    companyName: "GrowthFusion",
    location: "Delhi, India",
    jobType: "Full-time",
    salary: "₹10L - ₹16L",
    category: "Marketing",
    description: "Lead our marketing initiatives across digital and traditional channels, developing strategies to increase brand awareness and drive customer acquisition.",
    postedTime: "1 month ago",
    experienceLevel: "Mid Level"
  },
  {
    id: 5,
    title: "Backend Engineer",
    companyName: "CodeCraft",
    location: "Hyderabad, India",
    jobType: "Full-time",
    salary: "₹16L - ₹25L",
    category: "Technology",
    description: "Join our engineering team to develop robust, scalable backend services using Node.js, Python, and AWS. You'll be responsible for designing APIs, optimizing database performance, and ensuring high availability.",
    postedTime: "2 weeks ago",
    experienceLevel: "Mid Level"
  },
  {
    id: 6,
    title: "Product Manager",
    companyName: "InnovateCo",
    location: "Pune, India",
    jobType: "Full-time",
    salary: "₹15L - ₹24L",
    category: "Technology",
    description: "We're looking for a product manager to lead the development of our SaaS platform, working closely with engineers, designers, and stakeholders to deliver innovative solutions.",
    postedTime: "5 days ago",
    experienceLevel: "Senior Level",
    featured: true
  },
  {
    id: 7,
    title: "Financial Analyst",
    companyName: "AlphaFinance",
    location: "Mumbai, India",
    jobType: "Full-time",
    salary: "₹8L - ₹14L",
    category: "Finance",
    description: "Analyze financial data, prepare reports, and provide insights to support business decisions. You'll work with various departments to optimize financial performance and planning.",
    postedTime: "3 weeks ago",
    experienceLevel: "Entry Level"
  },
  {
    id: 8,
    title: "Human Resources Specialist",
    companyName: "PeopleFirst",
    location: "Remote",
    jobType: "Full-time",
    salary: "₹7L - ₹12L",
    category: "Human Resources",
    description: "Join our HR team to support recruitment, employee relations, and talent development initiatives. You'll help create a positive work environment and ensure compliance with policies and regulations.",
    postedTime: "1 week ago",
    experienceLevel: "Mid Level"
  },
  {
    id: 9,
    title: "DevOps Engineer",
    companyName: "CloudScale",
    location: "Bangalore, India",
    jobType: "Full-time",
    salary: "₹16L - ₹25L",
    category: "Technology",
    description: "Help us build and maintain our cloud infrastructure, CI/CD pipelines, and automation tools. You'll work with Kubernetes, Docker, and AWS to ensure reliable, scalable systems.",
    postedTime: "4 days ago",
    experienceLevel: "Mid Level"
  },
  {
    id: 10,
    title: "Sales Representative",
    companyName: "RevenuePro",
    location: "Chennai, India",
    jobType: "Full-time",
    salary: "₹6L - ₹10L + Commission",
    category: "Sales",
    description: "Drive business growth by identifying and pursuing new sales opportunities. You'll build relationships with potential clients and work to understand their needs and provide solutions.",
    postedTime: "2 weeks ago",
    experienceLevel: "Entry Level"
  },
  {
    id: 11,
    title: "Content Writer",
    companyName: "ContentCraft",
    location: "Remote",
    jobType: "Part-time",
    salary: "₹5L - ₹8L",
    category: "Marketing",
    description: "Create engaging content for our blog, social media, and marketing materials. You'll research industry topics and produce high-quality articles that resonate with our audience.",
    postedTime: "3 days ago",
    experienceLevel: "Mid Level"
  },
  {
    id: 12,
    title: "Mobile App Developer",
    companyName: "AppWorks",
    location: "Gurgaon, India",
    jobType: "Full-time",
    salary: "₹14L - ₹22L",
    category: "Technology",
    description: "Develop native iOS and Android applications using Swift, Kotlin, and React Native. You'll work on all aspects of the development lifecycle, from design to deployment.",
    postedTime: "1 week ago",
    experienceLevel: "Senior Level",
    featured: true
  },
  {
    id: 13,
    title: "Customer Support Specialist",
    companyName: "ServiceExcellence",
    location: "Noida, India",
    jobType: "Full-time",
    salary: "₹4L - ₹7L",
    category: "Customer Service",
    description: "Provide exceptional support to our customers through various channels, including phone, email, and chat. You'll troubleshoot issues, answer questions, and ensure customer satisfaction.",
    postedTime: "2 weeks ago",
    experienceLevel: "Entry Level"
  },
  {
    id: 14,
    title: "Graphic Designer",
    companyName: "CreativeVision",
    location: "Ahmedabad, India",
    jobType: "Contract",
    salary: "₹7L - ₹12L",
    category: "Design",
    description: "Create visually appealing designs for digital and print materials, including marketing collateral, social media graphics, and brand assets. You'll collaborate with the marketing team to support various campaigns.",
    postedTime: "4 days ago",
    experienceLevel: "Mid Level"
  },
  {
    id: 15,
    title: "Project Manager",
    companyName: "DeliverPro",
    location: "Kolkata, India",
    jobType: "Full-time",
    salary: "₹12L - ₹20L",
    category: "Management",
    description: "Lead cross-functional teams to successfully deliver projects on time and within budget. You'll define scope, create plans, manage resources, and communicate with stakeholders throughout the project lifecycle.",
    postedTime: "1 month ago",
    experienceLevel: "Senior Level"
  },
  {
    id: 16,
    title: "Network Administrator",
    companyName: "ConnectTech",
    location: "Jaipur, India",
    jobType: "Full-time",
    salary: "₹10L - ₹16L",
    category: "Technology",
    description: "Maintain and optimize our network infrastructure, ensuring reliability, security, and performance. You'll troubleshoot issues, implement upgrades, and monitor systems to prevent downtime.",
    postedTime: "2 weeks ago",
    experienceLevel: "Mid Level"
  },
  {
    id: 17,
    title: "Social Media Manager",
    companyName: "DigitalPulse",
    location: "Chandigarh, India",
    jobType: "Full-time",
    salary: "₹6L - ₹10L",
    category: "Marketing",
    description: "Develop and implement social media strategies to increase brand awareness, engagement, and lead generation. You'll create content, analyze performance, and stay current with platform trends.",
    postedTime: "5 days ago",
    experienceLevel: "Mid Level"
  },
  {
    id: 18,
    title: "Software Engineering Manager",
    companyName: "TechInnovate",
    location: "Bangalore, India",
    jobType: "Full-time",
    salary: "₹26L - ₹38L",
    category: "Technology",
    description: "Lead a team of software engineers, providing technical guidance, mentorship, and career development. You'll collaborate with product managers to define roadmaps and ensure successful delivery of features.",
    postedTime: "1 week ago",
    experienceLevel: "Senior Level",
    featured: true
  }
];

export let allJobs: JobType[] = [...initialJobs];

export const addNewJob = (job: JobType): Promise<JobType> => {
  return new Promise((resolve) => {
    allJobs = [job, ...allJobs];
    setTimeout(() => {
      resolve(job);
    }, 500);
  });
};

export const deleteJob = (jobId: number): Promise<boolean> => {
  return new Promise((resolve) => {
    allJobs = allJobs.filter(job => job.id !== jobId);
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};

export const getFeaturedJobs = () => allJobs.filter(job => job.featured);

export const categories = [
  { id: 1, name: 'Technology', jobCount: 8 },
  { id: 2, name: 'Design', jobCount: 5 },
  { id: 3, name: 'Marketing', jobCount: 6 },
  { id: 4, name: 'Finance', jobCount: 4 },
  { id: 5, name: 'Healthcare', jobCount: 7 },
  { id: 6, name: 'Education', jobCount: 3 },
  { id: 7, name: 'Sales', jobCount: 5 },
  { id: 8, name: 'Customer Service', jobCount: 4 }
];
