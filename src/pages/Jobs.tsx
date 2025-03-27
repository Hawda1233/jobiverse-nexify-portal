import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import JobCard from '@/components/JobCard';
import JobFilter from '@/components/JobFilter';
import SearchBar from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { getJobsFromFirestore, getPersonalizedJobs } from '@/lib/firestoreOperations';
import { JobType } from '@/lib/jobsData';
import { motion } from 'framer-motion';
import { Zap, Scan, BrainCircuit, Layers, Box, Globe, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Jobs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const searchParams = new URLSearchParams(location.search);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFiltersVisible, setIsFiltersVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState<JobType[]>([]);
  const [isPersonalized, setIsPersonalized] = useState(false);
  
  const { currentUser, userData } = useAuth();
  
  const searchTerm = searchParams.get('search') || '';
  const selectedLocation = searchParams.get('location') || '';
  const selectedCategory = searchParams.get('category') || '';
  
  // Fetch jobs from Firestore
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        let jobsData;
        
        // If user is logged in and is a candidate, fetch personalized jobs
        if (currentUser && userData && userData.role === 'candidate') {
          jobsData = await getPersonalizedJobs(currentUser.uid);
          setIsPersonalized(true);
        } else {
          // Otherwise fetch regular jobs
          jobsData = await getJobsFromFirestore();
          setIsPersonalized(false);
        }
        
        setJobs(jobsData);
        setTotalPages(Math.ceil(jobsData.length / 9));
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast({
          title: "Error",
          description: "Failed to load jobs. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJobs();
  }, [currentUser, userData, toast]);
  
  const getFilteredJobs = () => {
    let filtered = [...jobs];
    
    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedLocation) {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }
    
    if (selectedCategory && selectedCategory !== 'All Categories') {
      filtered = filtered.filter(job => 
        job.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    return filtered;
  };
  
  const filteredJobs = getFilteredJobs();
  const paginatedJobs = filteredJobs.slice((currentPage - 1) * 9, currentPage * 9);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedLocation, selectedCategory]);
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 bg-accent/5 w-[800px] h-[800px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 bg-secondary w-[600px] h-[600px] rounded-full -translate-x-1/3 translate-y-1/3" />
      </div>
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-3">Discover Opportunities</h1>
            <p className="text-muted-foreground">
              {isPersonalized 
                ? "Our AI has matched these jobs based on your skills and preferences"
                : "Our AI-powered platform analyzes your skills and preferences to match you with perfect opportunities"}
            </p>
            
            {isPersonalized && (
              <div className="mt-2 inline-flex items-center gap-1.5 bg-accent/10 text-accent px-3 py-1 rounded-full text-sm">
                <Zap size={14} />
                <span>AI-Powered Personalized Results</span>
              </div>
            )}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <SearchBar />
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: isFiltersVisible ? 1 : 0, x: isFiltersVisible ? 0 : -30 }}
              transition={{ duration: 0.3 }}
              className={`lg:col-span-1 ${!isFiltersVisible && 'hidden lg:block'}`}
            >
              <JobFilter />
            </motion.div>
            
            <div className="lg:col-span-3">
              <div className="flex justify-between items-center mb-6">
                <div className="text-sm text-muted-foreground flex items-center">
                  <button 
                    onClick={() => setIsFiltersVisible(!isFiltersVisible)} 
                    className="mr-3 lg:hidden flex items-center text-accent"
                  >
                    {isFiltersVisible ? 'Hide Filters' : 'Show Filters'}
                  </button>
                  Showing <span className="font-medium text-foreground mx-1">{paginatedJobs.length}</span> of{' '}
                  <span className="font-medium text-foreground ml-1">{filteredJobs.length}</span> jobs
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Sort by:</span>
                  <select className="text-sm border rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-accent bg-background">
                    <option>Relevance</option>
                    <option>Most Recent</option>
                    <option>Salary: High to Low</option>
                    <option>Salary: Low to High</option>
                  </select>
                </div>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-slate-200 rounded w-32"></div>
                    <div className="h-10 bg-slate-200 rounded w-64"></div>
                    <div className="h-4 bg-slate-200 rounded w-48"></div>
                  </div>
                </div>
              ) : paginatedJobs.length > 0 ? (
                <motion.div 
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8"
                >
                  {paginatedJobs.map(job => (
                    <motion.div key={job.id} variants={item}>
                      <JobCard job={job} featured={job.featured} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="neo-blur rounded-xl p-10 text-center"
                >
                  <h3 className="text-xl font-medium mb-2">No matching jobs found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search criteria or filters to see more results.
                  </p>
                  <Button 
                    onClick={() => navigate('/jobs')}
                    variant="outline"
                  >
                    Clear all filters
                  </Button>
                </motion.div>
              )}
              
              {filteredJobs.length > 0 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationLink 
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        className={currentPage === 1 ? "opacity-50 pointer-events-none" : "cursor-pointer"}
                      >
                        Previous
                      </PaginationLink>
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNumber = currentPage > 3 
                        ? currentPage - 3 + i + 1 
                        : i + 1;
                      
                      if (pageNumber <= totalPages) {
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink 
                              onClick={() => setCurrentPage(pageNumber)}
                              isActive={currentPage === pageNumber}
                              className="cursor-pointer"
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}
                    
                    <PaginationItem>
                      <PaginationLink 
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        className={currentPage === totalPages ? "opacity-50 pointer-events-none" : "cursor-pointer"}
                      >
                        Next
                      </PaginationLink>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-12 neo-blur rounded-xl p-6"
              >
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <BrainCircuit className="mr-2 text-accent" size={20} />
                  Future of Job Search
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-accent/5 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <Zap className="h-6 w-6 text-accent" />
                    </div>
                    <h4 className="font-medium mb-2">AI Matching</h4>
                    <p className="text-sm text-muted-foreground">Precision-matched opportunities based on your unique skills and career goals</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-accent/5 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <Box className="h-6 w-6 text-accent" />
                    </div>
                    <h4 className="font-medium mb-2">AR Interviews</h4>
                    <p className="text-sm text-muted-foreground">Practice with augmented reality to prepare for your real interviews</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-accent/5 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <Globe className="h-6 w-6 text-accent" />
                    </div>
                    <h4 className="font-medium mb-2">Blockchain Verified</h4>
                    <p className="text-sm text-muted-foreground">Credentials and work history secured and verified through blockchain technology</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Jobs;
