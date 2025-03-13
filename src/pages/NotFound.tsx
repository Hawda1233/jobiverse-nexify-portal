
import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="text-center max-w-lg">
          <div className="mb-6 relative mx-auto w-40 h-40">
            <div className="absolute inset-0 rounded-full bg-accent/10 animate-pulse-subtle"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="text-8xl font-bold text-accent">404</span>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
          
          <p className="text-muted-foreground mb-8">
            The page you are looking for doesn't exist or has been moved.
            Please check the URL or navigate back to the homepage.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild
              className="flex items-center gap-2"
            >
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            
            <Button 
              asChild
              variant="outline"
              className="flex items-center gap-2"
            >
              <Link to="/jobs">
                <Search className="h-4 w-4" />
                Browse Jobs
              </Link>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
