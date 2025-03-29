
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { sampleJobs } from "@/lib/jobsData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JobCard from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Building, Briefcase, MapPin, ChevronLeft, Star } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Companies data from the comparison tool
const companies = [
  { id: 1, name: 'Tata Consultancy Services', logo: '/tcs.svg' },
  { id: 2, name: 'Infosys', logo: '/infosys.svg' },
  { id: 3, name: 'Wipro', logo: '/wipro.svg' },
  { id: 4, name: 'HCL Technologies', logo: '/hcl.svg' },
  { id: 5, name: 'Tech Mahindra', logo: '/techmahindra.svg' },
  { id: 6, name: 'Accenture', logo: '/accenture.svg' },
  { id: 7, name: 'Cognizant', logo: '/cognizant.svg' },
  { id: 8, name: 'Capgemini', logo: '/capgemini.svg' },
  { id: 9, name: 'IBM India', logo: '/ibm.svg' },
  { id: 10, name: 'Microsoft India', logo: '/microsoft.svg' },
];

interface CompanyStats {
  workLifeBalance: number;
  salaryBenefits: number;
  culture: number;
  careerGrowth: number;
  management: number;
  avgSalary: string;
  hiringSeasonal: boolean;
  remoteFriendly: boolean;
  hiringVolume: 'High' | 'Medium' | 'Low';
}

const companyStats: Record<number, CompanyStats> = {
  1: { 
    workLifeBalance: 3.5, 
    salaryBenefits: 3.8, 
    culture: 4.0, 
    careerGrowth: 4.2, 
    management: 3.7,
    avgSalary: '₹6-18L',
    hiringSeasonal: true,
    remoteFriendly: false,
    hiringVolume: 'High'
  },
  2: { 
    workLifeBalance: 3.7, 
    salaryBenefits: 4.0, 
    culture: 3.9, 
    careerGrowth: 4.3, 
    management: 3.8,
    avgSalary: '₹7-22L',
    hiringSeasonal: true,
    remoteFriendly: true,
    hiringVolume: 'High'
  },
  3: { 
    workLifeBalance: 3.8, 
    salaryBenefits: 3.6, 
    culture: 3.7, 
    careerGrowth: 3.9, 
    management: 3.5,
    avgSalary: '₹6-16L',
    hiringSeasonal: true,
    remoteFriendly: true,
    hiringVolume: 'Medium'
  },
  4: { 
    workLifeBalance: 3.4, 
    salaryBenefits: 3.9, 
    culture: 3.6, 
    careerGrowth: 4.0, 
    management: 3.6,
    avgSalary: '₹7-20L',
    hiringSeasonal: false,
    remoteFriendly: true,
    hiringVolume: 'Medium'
  },
  5: { 
    workLifeBalance: 3.6, 
    salaryBenefits: 3.7, 
    culture: 3.8, 
    careerGrowth: 3.8, 
    management: 3.4,
    avgSalary: '₹5-18L',
    hiringSeasonal: false,
    remoteFriendly: true,
    hiringVolume: 'Medium'
  },
  6: { 
    workLifeBalance: 3.2, 
    salaryBenefits: 4.2, 
    culture: 4.1, 
    careerGrowth: 4.5, 
    management: 4.0,
    avgSalary: '₹8-25L',
    hiringSeasonal: true,
    remoteFriendly: false,
    hiringVolume: 'High'
  },
  7: { 
    workLifeBalance: 3.4, 
    salaryBenefits: 3.9, 
    culture: 3.7, 
    careerGrowth: 4.1, 
    management: 3.6,
    avgSalary: '₹6-20L',
    hiringSeasonal: true,
    remoteFriendly: true,
    hiringVolume: 'Medium'
  },
  8: { 
    workLifeBalance: 3.3, 
    salaryBenefits: 3.8, 
    culture: 3.9, 
    careerGrowth: 4.0, 
    management: 3.7,
    avgSalary: '₹7-19L',
    hiringSeasonal: false,
    remoteFriendly: true,
    hiringVolume: 'Medium'
  },
  9: { 
    workLifeBalance: 3.9, 
    salaryBenefits: 4.1, 
    culture: 4.0, 
    careerGrowth: 4.2, 
    management: 3.9,
    avgSalary: '₹8-28L',
    hiringSeasonal: false,
    remoteFriendly: true,
    hiringVolume: 'Medium'
  },
  10: { 
    workLifeBalance: 4.3, 
    salaryBenefits: 4.7, 
    culture: 4.5, 
    careerGrowth: 4.6, 
    management: 4.4,
    avgSalary: '₹15-60L',
    hiringSeasonal: false,
    remoteFriendly: true,
    hiringVolume: 'Low'
  }
};

// Company descriptions
const companyDescriptions: Record<string, string> = {
  "Tata Consultancy Services": "India's largest IT services company providing business solutions to global enterprises.",
  "Infosys": "A global leader in next-generation digital services and consulting helping clients navigate their digital transformation.",
  "Wipro": "Leading technology services company focused on building innovative solutions for complex digital transformation needs.",
  "HCL Technologies": "Global technology company helping enterprises reimagine their businesses for the digital age.",
  "Tech Mahindra": "Provider of digital transformation, consulting and business reengineering services across various industries.",
  "Accenture": "Global professional services company with capabilities in digital, cloud and security.",
  "Cognizant": "American multinational corporation that provides IT services and consulting services.",
  "Capgemini": "Global leader in consulting, technology services and digital transformation.",
  "IBM India": "American multinational technology corporation with operations in over 170 countries.",
  "Microsoft India": "American multinational technology corporation that produces computer software and consumer electronics.",
};

const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="flex items-center">
      <span className="text-lg font-semibold mr-2">{rating.toFixed(1)}</span>
      <div className="flex">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="half-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="50%" stopColor="currentColor"></stop>
                <stop offset="50%" stopColor="#D1D5DB"></stop>
              </linearGradient>
            </defs>
            <path fill="url(#half-gradient)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
        )}
        {Array.from({ length: 5 - fullStars - (hasHalfStar ? 1 : 0) }).map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
        ))}
      </div>
    </div>
  );
};

// Company Reviews page showing all companies
const CompanyJobs: React.FC = () => {
  const { company } = useParams<{ company: string }>();
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  const [companyJobs, setCompanyJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (company) {
      // Format company name
      const formattedCompanyName = company
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      // Find the company ID based on the name
      const companyData = companies.find(
        c => c.name.toLowerCase() === formattedCompanyName.toLowerCase()
      );
      
      if (companyData) {
        setSelectedCompany(companyData.id);
        
        // Load jobs for this company
        setLoading(true);
        setTimeout(() => {
          const filtered = sampleJobs.filter(job => 
            job.companyName.toLowerCase() === formattedCompanyName.toLowerCase()
          );
          setCompanyJobs(filtered);
          setLoading(false);
        }, 500);
      }
    }
  }, [company]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-20 flex-grow">
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center">
            <Building className="mr-2 h-6 w-6 text-primary" />
            Companies Review
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Browse through top Indian companies, view their ratings, and explore job opportunities.
          </p>
        </div>

        {/* Individual company view when company is selected */}
        {selectedCompany && (
          <>
            <div className="mb-6">
              <Link to="/companies">
                <Button variant="ghost" size="sm" className="mb-4">
                  <ChevronLeft className="h-4 w-4 mr-1" /> Back to All Companies
                </Button>
              </Link>
              
              <div className="bg-muted/30 p-6 rounded-lg border mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-secondary rounded-md flex items-center justify-center mr-4">
                    <Building className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{companies.find(c => c.id === selectedCompany)?.name}</h2>
                    <p className="text-muted-foreground">
                      {companyDescriptions[companies.find(c => c.id === selectedCompany)?.name || '']}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Company Ratings</h3>
                    <ul className="space-y-3">
                      <li className="flex justify-between">
                        <span>Work-Life Balance</span>
                        {renderStars(companyStats[selectedCompany].workLifeBalance)}
                      </li>
                      <li className="flex justify-between">
                        <span>Salary & Benefits</span>
                        {renderStars(companyStats[selectedCompany].salaryBenefits)}
                      </li>
                      <li className="flex justify-between">
                        <span>Company Culture</span>
                        {renderStars(companyStats[selectedCompany].culture)}
                      </li>
                      <li className="flex justify-between">
                        <span>Career Growth</span>
                        {renderStars(companyStats[selectedCompany].careerGrowth)}
                      </li>
                      <li className="flex justify-between">
                        <span>Management</span>
                        {renderStars(companyStats[selectedCompany].management)}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Hiring Information</h3>
                    <ul className="space-y-3">
                      <li className="flex justify-between">
                        <span>Average Salary Range</span>
                        <span className="font-semibold">{companyStats[selectedCompany].avgSalary}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Seasonal Hiring</span>
                        <span className={companyStats[selectedCompany].hiringSeasonal ? "text-green-600" : "text-amber-600"}>
                          {companyStats[selectedCompany].hiringSeasonal ? "Yes" : "No"}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span>Remote Friendly</span>
                        <span className={companyStats[selectedCompany].remoteFriendly ? "text-green-600" : "text-amber-600"}>
                          {companyStats[selectedCompany].remoteFriendly ? "Yes" : "No"}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span>Hiring Volume</span>
                        <span className={
                          companyStats[selectedCompany].hiringVolume === 'High' 
                            ? 'text-green-600' 
                            : companyStats[selectedCompany].hiringVolume === 'Medium'
                              ? 'text-amber-600'
                              : 'text-red-600'
                        }>
                          {companyStats[selectedCompany].hiringVolume}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-4">Available Jobs</h3>
              {loading ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : companyJobs.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {companyJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h4 className="text-xl font-semibold mb-2">No job listings found</h4>
                  <p className="text-muted-foreground mb-6">
                    We couldn't find any jobs for this company at the moment.
                  </p>
                  <Link to="/jobs">
                    <Button>View All Jobs</Button>
                  </Link>
                </div>
              )}
            </div>
          </>
        )}

        {/* List of all companies when no company is selected */}
        {!selectedCompany && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {companies.map((company) => (
              <Card key={company.id} className="card-hover">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary rounded-md flex items-center justify-center">
                      <Building className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-lg">{company.name}</h3>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {companyDescriptions[company.name]}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="outline" className="flex items-center gap-1">
                      Rating: {(
                        (companyStats[company.id].workLifeBalance + 
                         companyStats[company.id].salaryBenefits + 
                         companyStats[company.id].culture + 
                         companyStats[company.id].careerGrowth + 
                         companyStats[company.id].management) / 5
                      ).toFixed(1)}
                    </Badge>
                    <Badge variant="outline">
                      {companyStats[company.id].avgSalary}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to={`/companies/${company.name.toLowerCase().replace(/ /g, '-')}`} className="w-full">
                    <Button variant="outline" className="w-full">View Company</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CompanyJobs;
