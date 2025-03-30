import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getEmployerProfile } from "@/lib/profileOperations";
import { addJob } from "@/lib/supabaseOperations";
import { Loader2, Building2 } from "lucide-react";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { categories } from "@/lib/jobsData";

const formSchema = z.object({
  title: z.string().min(3, "Job title must be at least 3 characters"),
  company: z.string().min(1, "Company name is required"),
  location: z.string().min(1, "Location is required"),
  jobType: z.enum(["Full-time", "Part-time", "Contract", "Internship", "Remote"]),
  salary: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  experienceLevel: z.enum(["Entry Level", "Mid Level", "Senior Level", "Executive"]),
  description: z.string().min(50, "Description must be at least 50 characters"),
  featured: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const PostJob = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [companyInfo, setCompanyInfo] = useState<{ company: string, industry: string } | null>(null);
  const { userData } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Use form with zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      company: "",
      location: "",
      jobType: "Full-time",
      salary: "",
      category: "",
      experienceLevel: "Mid Level",
      description: "",
      featured: false,
    },
  });

  // Get company info once when component loads
  React.useEffect(() => {
    const loadEmployerProfile = async () => {
      if (!userData) return;
      
      try {
        const profile = await getEmployerProfile(userData.uid);
        if (profile) {
          setCompanyInfo({
            company: profile.company,
            industry: profile.industry
          });
          
          // Pre-fill company name
          form.setValue("company", profile.company);
        }
      } catch (error) {
        console.error("Error loading employer profile:", error);
      }
    };
    
    loadEmployerProfile();
  }, [userData, form]);

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    if (!userData) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to post a job",
        variant: "destructive",
      });
      navigate("/signin");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Add job to Supabase using our new function
      const jobData = {
        title: data.title,
        company_name: data.company,
        location: data.location,
        job_type: data.jobType,
        salary: data.salary || undefined,
        category: data.category,
        experience_level: data.experienceLevel,
        description: data.description,
        featured: data.featured,
        posted_by: userData.uid,
        keywords: generateKeywords(data.title, data.category, data.description)
      };
      
      await addJob(jobData);
      
      toast({
        title: "Job Posted Successfully",
        description: "Your job listing is now live",
      });
      
      // Navigate to HR dashboard
      navigate("/hr-dashboard");
    } catch (error) {
      console.error("Error posting job:", error);
      toast({
        title: "Error",
        description: "Failed to post job. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate keywords for better job searchability
  const generateKeywords = (title: string, category: string, description: string): string[] => {
    const combinedText = `${title} ${category} ${description}`;
    const words = combinedText.toLowerCase().split(/\s+/);
    const uniqueWords = [...new Set(words)];
    return uniqueWords
      .filter(word => word.length > 2)
      .filter(word => !["and", "the", "for", "with", "this", "that"].includes(word))
      .slice(0, 20);
  };

  if (!userData || userData.role !== "hr") {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">Access Restricted</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Only HR professionals can post jobs. Please sign in with an HR account.
            </p>
            <Button onClick={() => navigate("/signin")}>
              Sign In as HR
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Post a New Job</CardTitle>
          <CardDescription>
            Create a job listing to attract the perfect candidates for your position
          </CardDescription>
        </CardHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. Senior Frontend Developer" 
                          {...field} 
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. Tech Innovations Inc." 
                          {...field} 
                          disabled={!!companyInfo || isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. Mumbai, India or Remote" 
                          {...field} 
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="jobType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select job type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                          <SelectItem value="Internship">Internship</SelectItem>
                          <SelectItem value="Remote">Remote</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salary Range (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. ₹15L - ₹25L" 
                          {...field} 
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormDescription>
                        Jobs with salary information get more applicants
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="experienceLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience Level</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select experience level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Entry Level">Entry Level</SelectItem>
                          <SelectItem value="Mid Level">Mid Level</SelectItem>
                          <SelectItem value="Senior Level">Senior Level</SelectItem>
                          <SelectItem value="Executive">Executive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select job category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Provide a detailed description of the role, responsibilities, requirements, benefits, etc." 
                        className="min-h-[200px]" 
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      A comprehensive description helps attract suitable candidates
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Feature this job</FormLabel>
                      <FormDescription>
                        Featured jobs appear at the top of search results and get more visibility
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => navigate("/hr-dashboard")} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>Post Job</>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default PostJob;
