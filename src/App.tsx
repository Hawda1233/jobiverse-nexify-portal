
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
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
import ComparisonTool from "./pages/ComparisonTool";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import JobseekerDashboard from "./pages/JobseekerDashboard";
import Applications from "./pages/Applications";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const queryClient = new QueryClient();

// Layout component that includes Navbar and Footer
const MainLayout = () => (
  <>
    <Navbar />
    <div className="min-h-screen pt-20 pb-20">
      <Outlet />
    </div>
    <Footer />
  </>
);

// Layout for pages that don't need Navbar/Footer
const CleanLayout = () => {
  return (
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
      <Outlet />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Routes with navbar and footer */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/companies" element={<Jobs />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/comparison" element={<ComparisonTool />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
            </Route>
            
            {/* Routes with only back button */}
            <Route element={<CleanLayout />}>
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route path="/interview" element={<InterviewSimulator />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/hr-signup" element={<HRSignUp />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/dashboard" element={<JobseekerDashboard />} />
              <Route path="/applications" element={<Applications />} />
              <Route path="/hr-dashboard" element={<HRDashboard />} />
              <Route path="/post-job" element={<PostJob />} />
              <Route path="/companies/:company" element={<CompanyJobs />} />
              <Route path="/resources/:topic" element={<ResourceDetail />} />
              <Route path="/resources/company/:companyId" element={<ResourceDetail />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
