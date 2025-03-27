
import React from 'react';
import Hero from '@/components/Hero';
import JobCard from '@/components/JobCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, BarChart, BriefcaseBusiness, CheckCircle, ChevronRight, Globe, Layers, User } from 'lucide-react';
import { getFeaturedJobs, categories } from '@/lib/jobsData';

const Index = () => {
  // Get featured jobs using the getter function
  const featuredJobs = getFeaturedJobs();
  
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Hero />
        
        {/* Featured jobs section */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
              <div>
                <h2 className="text-3xl font-bold mb-2">Featured Jobs</h2>
                <p className="text-muted-foreground">Explore our handpicked opportunities from top companies</p>
              </div>
              <Link to="/jobs">
                <Button variant="outline" className="flex items-center gap-2">
                  <span>View all jobs</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredJobs.slice(0, 6).map((job) => (
                <JobCard key={job.id} job={job} featured={job.id % 2 === 0} />
              ))}
            </div>
          </div>
        </section>
        
        {/* Account section - NEW */}
        <section className="py-12 bg-accent/5">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-3">Join Nexify Today</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Create an account as a job seeker or employer to unlock all features
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="neo-blur rounded-xl p-8 flex flex-col items-center text-center card-hover">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <User className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-3">Job Seekers</h3>
                <p className="text-muted-foreground mb-6">
                  Find your dream job with AI-powered matching, apply with one click, and track your applications
                </p>
                <Link to="/signup" className="w-full">
                  <Button className="w-full">
                    Create Job Seeker Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/signin" className="mt-3 text-sm text-accent hover:underline">
                  Already have an account? Sign in
                </Link>
              </div>
              
              <div className="neo-blur rounded-xl p-8 flex flex-col items-center text-center card-hover">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <BriefcaseBusiness className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-3">Employers</h3>
                <p className="text-muted-foreground mb-6">
                  Post jobs, find qualified candidates quickly, and manage applications all in one place
                </p>
                <Link to="/signup?tab=employer" className="w-full">
                  <Button className="w-full bg-accent hover:bg-accent/90">
                    Create Employer Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/signin?tab=employer" className="mt-3 text-sm text-accent hover:underline">
                  Already have an account? Sign in
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Categories section */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Explore Job Categories</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Browse jobs by industry to find the perfect role that matches your expertise and career goals
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category) => (
                <Link 
                  key={category.id} 
                  to={`/jobs?category=${category.name}`}
                  className="neo-blur rounded-xl p-6 flex flex-col items-center text-center card-hover"
                >
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                    {getCategoryIcon(category.name)}
                  </div>
                  <h3 className="font-medium mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{category.jobCount} jobs</p>
                  <span className="text-xs text-accent flex items-center">
                    Browse <ChevronRight className="h-3 w-3 ml-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
        
        {/* Features section */}
        <section className="py-16 bg-accent/5 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-0 bg-accent/5 w-[800px] h-[800px] rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 bg-primary/5 w-[600px] h-[600px] rounded-full translate-x-1/3 translate-y-1/3" />
          </div>
          
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-3">Why Choose Nexify</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our innovative platform offers unique features designed to streamline your job search
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Award />}
                title="AI-Powered Matching"
                description="Our advanced algorithms analyze your skills and preferences to find the perfect job matches."
              />
              <FeatureCard 
                icon={<BarChart />}
                title="Salary Insights"
                description="Get detailed salary information for different roles, experience levels, and locations."
              />
              <FeatureCard 
                icon={<CheckCircle />}
                title="One-Click Apply"
                description="Apply to multiple jobs with a single click using your saved profile and resume."
              />
              <FeatureCard 
                icon={<Globe />}
                title="Global Opportunities"
                description="Explore remote and international positions from companies worldwide."
              />
              <FeatureCard 
                icon={<BriefcaseBusiness />}
                title="Company Profiles"
                description="Research potential employers with in-depth company profiles and reviews."
              />
              <FeatureCard 
                icon={<Layers />}
                title="Career Resources"
                description="Access guides, templates, and advice to help you advance in your career."
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="neo-blur rounded-xl p-6 card-hover">
      <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
        <div className="text-accent">{icon}</div>
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

// Helper function to get category icon
const getCategoryIcon = (category: string) => {
  const iconClassName = "h-6 w-6 text-accent";
  
  switch (category.toLowerCase()) {
    case 'technology':
      return <Globe className={iconClassName} />;
    case 'design':
      return <Layers className={iconClassName} />;
    case 'marketing':
      return <BarChart className={iconClassName} />;
    case 'finance':
      return <DollarSign className={iconClassName} />;
    case 'healthcare':
      return <Heart className={iconClassName} />;
    case 'education':
      return <BookOpen className={iconClassName} />;
    case 'sales':
      return <TrendingUp className={iconClassName} />;
    case 'customer service':
      return <Users className={iconClassName} />;
    default:
      return <Briefcase className={iconClassName} />;
  }
};

// Importable icons not previously used
import { 
  Briefcase, 
  BookOpen, 
  DollarSign, 
  Heart, 
  TrendingUp, 
  Users 
} from 'lucide-react';

export default Index;
