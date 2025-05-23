
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import OfflineWarning from "@/components/OfflineWarning";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import HRSignUp from "./pages/HRSignUp";
import PostJob from "./pages/PostJob";
import HRDashboard from "./pages/HRDashboard";
import NotFound from "./pages/NotFound";
import InterviewSimulator from "./pages/InterviewSimulator";
import Profile from "./pages/Profile";
import CompanyJobs from "./pages/CompanyJobs";
import ResourcesPage from "./pages/ResourcesPage";
import ResourceDetail from "./pages/ResourceDetail";
import TechTrends2025Detail from "./pages/TechTrends2025Detail";
import ComparisonTool from "./pages/ComparisonTool";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import JobseekerDashboard from "./pages/JobseekerDashboard";
import Applications from "./pages/Applications";
import Navbar from "@/components/Navbar";
import HRNavbar from "@/components/HRNavbar";
import Footer from "@/components/Footer";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingFallback from "@/components/LoadingFallback";
import { Suspense, useEffect } from "react";
import { initializeSupabase } from "./lib/createSupabaseTables";

// Only use useAuth inside components that are children of AuthProvider
const ProtectedRoute = ({ requiredRole, children }: { requiredRole?: "candidate" | "hr", children: React.ReactNode }) => {
  const { currentUser, userData, loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center">
      <LoadingFallback />
    </div>;
  }

  if (!currentUser) {
    return <Navigate to="/signin" replace />;
  }

  if (requiredRole && userData?.role !== requiredRole) {
    return requiredRole === "hr" ? 
      <Navigate to="/dashboard" replace /> : 
      <Navigate to="/hr-dashboard" replace />;
  }

  return <>{children}</>;
};

const JobseekerLayout = () => {
  const { loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <LoadingFallback />
    </div>;
  }

  return (
    <ErrorBoundary>
      <Navbar />
      <div className="min-h-screen pt-16">
        <Suspense fallback={<LoadingFallback />}>
          <Outlet />
        </Suspense>
      </div>
      <Footer />
    </ErrorBoundary>
  );
};

const HRLayout = () => {
  const { loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <LoadingFallback />
    </div>;
  }

  return (
    <ErrorBoundary>
      <HRNavbar />
      <div className="min-h-screen pt-16">
        <Suspense fallback={<LoadingFallback />}>
          <Outlet />
        </Suspense>
      </div>
      <Footer />
    </ErrorBoundary>
  );
};

const CleanLayout = () => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <div className="fixed top-4 left-4 z-50">
          <Button
            variant="outline"
            size="icon"
            onClick={() => window.history.back()}
            className="rounded-full bg-background/60 backdrop-blur-sm"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>
        <Suspense fallback={<LoadingFallback />}>
          <Outlet />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
};

const PublicLayout = () => {
  const { userData } = useAuth();
  
  if (userData?.role === "hr") {
    return <HRLayout />;
  }
  
  return <JobseekerLayout />;
};

// This component uses useAuth and must be wrapped by AuthProvider
const AuthenticatedRoutes = () => {
  const { currentUser, userData, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingFallback />
      </div>
    );
  }

  if (currentUser && userData) {
    const isOnAuthPage = window.location.pathname === '/signin' || 
                        window.location.pathname === '/signup' || 
                        window.location.pathname === '/hr-signup';
    
    if (isOnAuthPage) {
      if (userData.role === 'hr') {
        return <Navigate to="/hr-dashboard" replace />;
      } else {
        return <Navigate to="/dashboard" replace />;
      }
    }
  }
  
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route path="/" element={<Index />} />
      </Route>
      
      <Route element={<CleanLayout />}>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/hr-signup" element={<HRSignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
      </Route>
      
      <Route element={
        <ProtectedRoute requiredRole="candidate">
          <JobseekerLayout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<JobseekerDashboard />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/companies" element={<Jobs />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/comparison" element={<ComparisonTool />} />
      </Route>
      
      <Route element={
        <ProtectedRoute requiredRole="hr">
          <HRLayout />
        </ProtectedRoute>
      }>
        <Route path="/hr-dashboard" element={<HRDashboard />} />
        <Route path="/post-job" element={<PostJob />} />
        <Route path="/hr-dashboard/jobs" element={<HRDashboard />} />
        <Route path="/hr-dashboard/applications" element={<HRDashboard />} />
        <Route path="/hr-dashboard/candidates" element={<HRDashboard />} />
        <Route path="/hr-dashboard/analytics" element={<HRDashboard />} />
        <Route path="/hr-dashboard/company" element={<HRDashboard />} />
      </Route>
      
      <Route element={<CleanLayout />}>
        <Route path="/jobs/:id" element={
          <ProtectedRoute>
            <JobDetails />
          </ProtectedRoute>
        } />
        <Route path="/interview" element={
          <ProtectedRoute>
            <InterviewSimulator />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        
        <Route path="/companies/:company" element={
          <ProtectedRoute>
            <CompanyJobs />
          </ProtectedRoute>
        } />
        <Route path="/resources/:topic" element={
          <ProtectedRoute>
            <ResourceDetail />
          </ProtectedRoute>
        } />
        <Route path="/resources/company/:companyId" element={
          <ProtectedRoute>
            <ResourceDetail />
          </ProtectedRoute>
        } />
        <Route path="/resources/tech-trends-2025" element={
          <ProtectedRoute>
            <TechTrends2025Detail />
          </ProtectedRoute>
        } />
        <Route path="/resources/tech-trends-2025/:section" element={
          <ProtectedRoute>
            <TechTrends2025Detail />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

// Main App component - ensure AuthProvider wraps everything that uses useAuth
const App = () => {
  useEffect(() => {
    initializeSupabase().catch(console.error);
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ServiceWorkerRegistration />
            <OfflineWarning />
            <AuthenticatedRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
