
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/interview" element={<InterviewSimulator />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/hr-signup" element={<HRSignUp />} />
            <Route path="/profile" element={<Profile />} />
            
            {/* HR routes */}
            <Route path="/hr-dashboard" element={<HRDashboard />} />
            <Route path="/post-job" element={<PostJob />} />
            
            {/* Companies routes */}
            <Route path="/companies" element={<Jobs />} />
            <Route path="/companies/:company" element={<CompanyJobs />} />
            
            {/* Resources routes */}
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/resources/:topic" element={<ResourceDetail />} />
            <Route path="/resources/company/:companyId" element={<ResourceDetail />} />
            
            {/* Comparison Tool route */}
            <Route path="/comparison" element={<ComparisonTool />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
