
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu, X, User, BriefcaseBusiness, LogOut, ChartBarIcon, Users, FileText, LayoutDashboard, ClipboardList, PlusCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const HRNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Success",
        description: "You have been logged out successfully",
      });
      navigate('/');
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getUserInitials = () => {
    if (!currentUser?.email) return "HR";
    return currentUser.email.charAt(0).toUpperCase();
  };

  return (
    <header
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300 px-4 md:px-8',
        isScrolled
          ? 'py-2 neo-blur'
          : 'py-4 bg-transparent'
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link 
          to="/hr-dashboard" 
          className="flex items-center gap-2 font-bold text-2xl transition-all hover:opacity-80"
        >
          <BriefcaseBusiness className="h-8 w-8 text-accent" />
          <span className="hidden sm:inline">Nexify HR</span>
        </Link>

        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/hr-dashboard">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <FileText className="h-4 w-4 mr-2" />
                  Job Management
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex items-center p-3 gap-3 rounded-md hover:bg-accent hover:text-accent-foreground"
                          to="/post-job"
                        >
                          <PlusCircle className="h-5 w-5" />
                          <div>
                            <div className="text-sm font-medium">Post New Job</div>
                            <p className="text-xs text-muted-foreground">
                              Create a new job listing
                            </p>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex items-center p-3 gap-3 rounded-md hover:bg-accent hover:text-accent-foreground"
                          to="/hr-dashboard/jobs"
                        >
                          <ClipboardList className="h-5 w-5" />
                          <div>
                            <div className="text-sm font-medium">Manage Jobs</div>
                            <p className="text-xs text-muted-foreground">
                              Review and edit your job listings
                            </p>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <Users className="h-4 w-4 mr-2" />
                  Candidates
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex items-center p-3 gap-3 rounded-md hover:bg-accent hover:text-accent-foreground"
                          to="/hr-dashboard/applications"
                        >
                          <ClipboardList className="h-5 w-5" />
                          <div>
                            <div className="text-sm font-medium">Applications</div>
                            <p className="text-xs text-muted-foreground">
                              Review job applications
                            </p>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex items-center p-3 gap-3 rounded-md hover:bg-accent hover:text-accent-foreground"
                          to="/hr-dashboard/candidates"
                        >
                          <Users className="h-5 w-5" />
                          <div>
                            <div className="text-sm font-medium">Candidate Database</div>
                            <p className="text-xs text-muted-foreground">
                              Browse and search candidates
                            </p>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                  <Link to="/hr-dashboard/analytics">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 17.5v-2.5"/><path d="M12 17.5v-7"/><path d="M16 17.5v-5"/></svg>
                    Analytics
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => navigate('/post-job')}
          >
            <PlusCircle className="h-4 w-4" />
            <span>Post Job</span>
          </Button>
          
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src={currentUser.photoURL || ""} />
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>HR Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/hr-dashboard')}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/hr-dashboard/company')}>
                  <BriefcaseBusiness className="mr-2 h-4 w-4" />
                  Company Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" className="flex items-center gap-2" onClick={() => navigate('/signin?tab=employer')}>
                <User className="h-4 w-4" />
                <span>Sign In</span>
              </Button>
              <Button onClick={() => navigate('/hr-signup')}>Sign Up</Button>
            </div>
          )}
        </div>

        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full neo-blur py-4 px-6 animate-fade-in">
          <nav className="flex flex-col gap-4 mb-4">
            <MobileNavLink to="/hr-dashboard" active={location.pathname === '/hr-dashboard'}>
              <div className="flex items-center">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </div>
            </MobileNavLink>
            <MobileNavLink to="/post-job" active={location.pathname === '/post-job'}>
              <div className="flex items-center">
                <PlusCircle className="mr-2 h-4 w-4" />
                Post Job
              </div>
            </MobileNavLink>
            <MobileNavLink to="/hr-dashboard/jobs" active={location.pathname === '/hr-dashboard/jobs'}>
              <div className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Manage Jobs
              </div>
            </MobileNavLink>
            <MobileNavLink to="/hr-dashboard/applications" active={location.pathname === '/hr-dashboard/applications'}>
              <div className="flex items-center">
                <ClipboardList className="mr-2 h-4 w-4" />
                Applications
              </div>
            </MobileNavLink>
            <MobileNavLink to="/hr-dashboard/candidates" active={location.pathname === '/hr-dashboard/candidates'}>
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Candidates
              </div>
            </MobileNavLink>
            <MobileNavLink to="/hr-dashboard/analytics" active={location.pathname === '/hr-dashboard/analytics'}>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 17.5v-2.5"/><path d="M12 17.5v-7"/><path d="M16 17.5v-5"/></svg>
                Analytics
              </div>
            </MobileNavLink>
            <MobileNavLink to="/hr-dashboard/company" active={location.pathname === '/hr-dashboard/company'}>
              <div className="flex items-center">
                <BriefcaseBusiness className="mr-2 h-4 w-4" />
                Company Profile
              </div>
            </MobileNavLink>
          </nav>
          
          <div className="flex flex-col gap-3">
            {currentUser ? (
              <>
                <Button variant="outline" className="flex items-center justify-center gap-2 w-full" onClick={() => navigate('/profile')}>
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Button>
                <Button variant="destructive" className="w-full" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" className="flex items-center justify-center gap-2 w-full" onClick={() => navigate('/signin?tab=employer')}>
                  <User className="h-4 w-4" />
                  <span>Sign In</span>
                </Button>
                <Button className="w-full" onClick={() => navigate('/hr-signup')}>Sign Up</Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

interface NavLinkProps {
  to: string;
  active: boolean;
  children: React.ReactNode;
}

const MobileNavLink = ({ to, active, children }: NavLinkProps) => (
  <Link
    to={to}
    className={cn(
      'py-2 font-medium transition-colors',
      active ? 'text-accent' : 'text-foreground/80'
    )}
  >
    {children}
  </Link>
);

export default HRNavbar;
