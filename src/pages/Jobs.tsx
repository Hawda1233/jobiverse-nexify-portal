import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import JobCard from '@/components/JobCard';
import JobFilter from '@/components/JobFilter';
import SearchBar from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { allJobs } from '@/lib/jobsData';

const Jobs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(Math.ceil(allJobs.length / 9));
  
  const searchTerm = searchParams.get('search') || '';
  const selectedLocation = searchParams.get('location') || '';
  const selectedCategory = searchParams.get('category') || '';
  
  const getFilteredJobs = () => {
    let filtered = [...allJobs];
    
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
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-3">Browse Jobs</h1>
            <p className="text-muted-foreground">
              Find your dream job from our curated selection of opportunities
            </p>
          </div>
          
          <div className="mb-8">
            <SearchBar />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <JobFilter />
            </div>
            
            <div className="lg:col-span-3">
              <div className="flex justify-between items-center mb-6">
                <div className="text-sm text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{paginatedJobs.length}</span> of{' '}
                  <span className="font-medium text-foreground">{filteredJobs.length}</span> jobs
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
              
              {paginatedJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {paginatedJobs.map(job => (
                    <JobCard key={job.id} job={job} featured={job.featured} />
                  ))}
                </div>
              ) : (
                <div className="neo-blur rounded-xl p-10 text-center">
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
                </div>
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
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Jobs;
