
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { allJobs } from "@/lib/jobsData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JobCard from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Building, Briefcase, MapPin, ChevronLeft } from "lucide-react";

// Filter jobs by company
const CompanyJobs: React.FC = () => {
  const { company } = useParams<{ company: string }>();
  const [jobs, setJobs] = useState(allJobs);
  const [loading, setLoading] = useState(true);
  
  // Format company name for display
  const formatCompanyName = (name: string): string => {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  const companyName = company ? formatCompanyName(company) : '';
  
  useEffect(() => {
    // Simulate data fetching
    setLoading(true);
    setTimeout(() => {
      const filtered = allJobs.filter(job => 
        job.company?.toLowerCase() === companyName.toLowerCase()
      );
      setJobs(filtered);
      setLoading(false);
    }, 500);
  }, [company, companyName]);

  // Company descriptions
  const companyDescriptions: Record<string, string> = {
    "Tata Consultancy Services": "India's largest IT services company providing business solutions to global enterprises.",
    "Infosys": "A global leader in next-generation digital services and consulting helping clients navigate their digital transformation.",
    "Wipro": "Leading technology services company focused on building innovative solutions for complex digital transformation needs.",
    "HCL Technologies": "Global technology company helping enterprises reimagine their businesses for the digital age.",
    "Tech Mahindra": "Provider of digital transformation, consulting and business reengineering services across various industries.",
    "Reliance Industries": "India's largest private sector company with businesses across energy, petrochemicals, telecom, and retail."
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-20 flex-grow">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Link to="/companies">
              <Button variant="ghost" size="sm" className="mb-2">
                <ChevronLeft className="h-4 w-4 mr-1" /> Back to Companies
              </Button>
            </Link>
            <h1 className="text-3xl font-bold flex items-center">
              <Building className="mr-2 h-6 w-6 text-primary" />
              {companyName} Jobs
            </h1>
            {companyDescriptions[companyName] && (
              <p className="text-muted-foreground mt-2 max-w-2xl">
                {companyDescriptions[companyName]}
              </p>
            )}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i} 
                className="h-48 bg-muted animate-pulse rounded-lg"
              />
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Briefcase className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No job listings found</h2>
            <p className="text-muted-foreground mb-6">
              We couldn't find any jobs for {companyName} at the moment.
            </p>
            <Link to="/jobs">
              <Button>View All Jobs</Button>
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CompanyJobs;
