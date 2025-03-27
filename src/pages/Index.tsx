import React, { lazy, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, BarChart, BriefcaseBusiness, CheckCircle, ChevronRight, Globe, Layers, User } from 'lucide-react';
import { getFeaturedJobs, categories } from '@/lib/jobsData';
import SEOHead from '@/components/SEOHead';

const Hero = lazy(() => import('@/components/Hero'));
const JobCard = lazy(() => import('@/components/JobCard'));

const HeroFallback = () => (
  <div className="py-24 mt-10 flex items-center justify-center">
    <div className="animate-pulse space-y-8 w-full max-w-4xl mx-auto">
      <div className="h-8 bg-slate-200 rounded w-1/3 mx-auto"></div>
      <div className="h-16 bg-slate-200 rounded w-2/3 mx-auto"></div>
      <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto"></div>
      <div className="h-12 bg-slate-200 rounded w-3/4 mx-auto"></div>
      <div className="grid grid-cols-3 gap-4">
        <div className="h-28 bg-slate-200 rounded w-full"></div>
        <div className="h-28 bg-slate-200 rounded w-full"></div>
        <div className="h-28 bg-slate-200 rounded w-full"></div>
      </div>
    </div>
  </div>
);

const JobCardFallback = () => (
  <div className="neo-blur rounded-xl p-6 h-[300px] animate-pulse">
    <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-slate-200 rounded w-1/3 mb-4"></div>
    <div className="h-24 bg-slate-200 rounded w-full mb-4"></div>
    <div className="h-8 bg-slate-200 rounded w-1/3"></div>
  </div>
);

const Index = () => {
  const featuredJobs = getFeaturedJobs();
  
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead 
        title="Nexify - Find Your Dream Career With AI-Powered Precision"
        description="Nexify uses cutting-edge AI, blockchain verification and AR interview technology to match your skills with the perfect opportunities, elevating your career journey."
        keywords="job search, career, AI matching, blockchain verification, AR interviews, HR professionals"
        canonical="/"
      />
      
      <main className="flex-grow">
        <Suspense fallback={<HeroFallback />}>
          <Hero />
        </Suspense>
        
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
                <Suspense key={job.id} fallback={<JobCardFallback />}>
                  <JobCard key={job.id} job={job} featured={job.id % 2 === 0} />
                </Suspense>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-12 bg-accent/5">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-3">Join Nexify Today</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Create an account as a job seeker or HR professional to unlock all features
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
                <h3 className="text-xl font-bold mb-3">HR Professionals</h3>
                <p className="text-muted-foreground mb-6">
                  Post jobs, find qualified candidates quickly, and manage applications all in one place
                </p>
                <Link to="/signup?tab=hr" className="w-full">
                  <Button className="w-full bg-accent hover:bg-accent/90">
                    Create HR Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/signin?tab=hr" className="mt-3 text-sm text-accent hover:underline">
                  Already have an HR account? Sign in
                </Link>
              </div>
            </div>
          </div>
        </section>
        
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

import { 
  Briefcase, 
  BookOpen, 
  DollarSign, 
  Heart, 
  TrendingUp, 
  Users 
} from 'lucide-react';

export default Index;
