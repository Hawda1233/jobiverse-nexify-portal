
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Mail, Lock, Briefcase, User } from "lucide-react";
import { saveCandidateProfile } from "@/lib/profileOperations";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"jobseeker" | "employer">("jobseeker");
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Read the tab from URL if it exists
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab === 'employer') {
      setActiveTab('employer');
    }
  }, []);

  // Update URL when tab changes
  useEffect(() => {
    const url = new URL(window.location.href);
    if (activeTab === 'employer') {
      url.searchParams.set('tab', 'employer');
    } else {
      url.searchParams.delete('tab');
    }
    window.history.replaceState({}, '', url.toString());
  }, [activeTab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      const userCredential = await signup(email, password, false);
      
      // Create candidate profile
      await saveCandidateProfile({
        uid: userCredential.user.uid,
        email,
        fullName: fullName || null
      });
      
      toast({
        title: "Success!",
        description: "Your account has been created.",
      });
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to create an account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await loginWithGoogle();
      
      // Create basic candidate profile if user doesn't exist
      try {
        await saveCandidateProfile({
          uid: result.user.uid,
          email: result.user.email || '',
          fullName: result.user.displayName || undefined
        });
      } catch (profileError) {
        console.error("Error creating profile:", profileError);
      }
      
      toast({
        title: "Success!",
        description: "Your account has been created with Google.",
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Google sign up error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create an account with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-80px)]">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
              {activeTab === "jobseeker" ? 
                <User className="h-8 w-8 text-accent" /> : 
                <Briefcase className="h-8 w-8 text-accent" />
              }
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
          <CardDescription className="text-center">
            Join Nexify to {activeTab === "jobseeker" ? "find your dream job" : "hire top talent"}
          </CardDescription>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "jobseeker" | "employer")} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger 
              value="jobseeker" 
              className="flex items-center gap-2 data-[state=active]:bg-accent data-[state=active]:text-white"
            >
              <User className="h-4 w-4" />
              <span>Job Seeker</span>
            </TabsTrigger>
            <TabsTrigger 
              value="employer" 
              className="flex items-center gap-2 data-[state=active]:bg-accent data-[state=active]:text-white"
            >
              <Briefcase className="h-4 w-4" />
              <span>Employer</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="jobseeker">
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      type="text"
                      className="pl-10"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      placeholder="you@example.com"
                      type="email"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      className="pl-10"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Job Seeker Account"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                
                <div className="relative w-full">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-muted" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={handleGoogleSignUp}
                  disabled={isGoogleLoading}
                >
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                  {isGoogleLoading ? "Signing up with Google..." : "Sign up with Google"}
                </Button>
                
                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/signin" className="text-accent hover:underline">
                    Sign in
                  </Link>
                </p>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="employer">
            <div className="p-6 text-center">
              <div className="bg-accent/10 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                <Briefcase className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-lg font-medium mb-2">Create an Employer Account</h3>
              <p className="text-muted-foreground mb-6">
                Sign up as an employer to post jobs and find candidates
              </p>
              <Button 
                className="w-full bg-accent hover:bg-accent/90" 
                onClick={() => navigate('/hr-signup')}
              >
                Create Employer Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <div className="mt-6 text-sm text-muted-foreground">
                Already have an employer account?{" "}
                <Link to="/signin?tab=employer" className="text-accent hover:underline">
                  Sign in
                </Link>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default SignUp;
