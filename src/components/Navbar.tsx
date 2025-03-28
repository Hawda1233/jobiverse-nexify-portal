
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu, X, User, BriefcaseBusiness, Bell, LogOut, Briefcase, Building, BookOpen, Scale, LayoutDashboard, ClipboardList, LogIn } from 'lucide-react';
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

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, userData, logout } = useAuth();
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

  const handleProtectedNavigation = (path: string) => {
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access this feature",
      });
      navigate('/signin');
      return;
    }
    navigate(path);
  };

  const getUserInitials = () => {
    if (!currentUser?.email) return "U";
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
          to="/" 
          className="flex items-center gap-2 font-bold text-2xl transition-all hover:opacity-80"
        >
          <BriefcaseBusiness className="h-8 w-8 text-accent" />
          <span className="hidden sm:inline">Nexify</span>
        </Link>

        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to={currentUser ? "/jobs" : "#"} onClick={(e) => {
                  if (!currentUser) {
                    e.preventDefault();
                    handleProtectedNavigation('/jobs');
                  }
                }}>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Browse Jobs
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger onClick={(e) => {
                  if (!currentUser) {
                    e.stopPropagation();
                    handleProtectedNavigation('/companies');
                    return;
                  }
                }}>Companies</NavigationMenuTrigger>
                {currentUser && (
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex flex-col justify-end w-full h-full p-6 no-underline rounded-md outline-none select-none bg-gradient-to-b from-muted/50 to-muted focus:shadow-md"
                            href="/companies"
                          >
                            <Building className="h-6 w-6 mb-2" />
                            <div className="text-lg font-medium">Top Indian Companies</div>
                            <p className="text-sm text-muted-foreground">
                              Explore opportunities at India's leading tech firms
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <ListItem href="/companies/tcs" title="Tata Consultancy Services">
                        India's largest IT services and consulting company
                      </ListItem>
                      <ListItem href="/companies/infosys" title="Infosys">
                        Global leader in next-generation digital services
                      </ListItem>
                      <ListItem href="/companies/wipro" title="Wipro">
                        Leading technology services and consulting company
                      </ListItem>
                      <ListItem href="/companies/hcl" title="HCL Technologies">
                        Global technology company helping enterprises reimagine their businesses
                      </ListItem>
                      <ListItem href="/companies/techmahindra" title="Tech Mahindra">
                        Provider of digital transformation, consulting and business reengineering services
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                )}
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger onClick={(e) => {
                  if (!currentUser) {
                    e.stopPropagation();
                    handleProtectedNavigation('/resources');
                    return;
                  }
                }}>Resources</NavigationMenuTrigger>
                {currentUser && (
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <ListItem href="/resources/interview-preparation" title="Interview Preparation">
                        Tips, common questions, and strategies for tech interviews
                      </ListItem>
                      <ListItem href="/resources/resume-tips" title="Resume Building">
                        Expert advice on creating a standout technical resume
                      </ListItem>
                      <ListItem href="/resources/skills-development" title="Skills Development">
                        Resources to develop in-demand technical skills
                      </ListItem>
                      <ListItem href="/resources/career-paths" title="Career Paths">
                        Guidance on various tech career trajectories in India
                      </ListItem>
                      <ListItem href="/resources/industry-trends" title="Industry Trends">
                        Latest trends and technologies in the Indian tech industry
                      </ListItem>
                      <ListItem href="/resources/salary-guides" title="Salary Guides">
                        Comprehensive salary information for tech roles in India
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                )}
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to={currentUser ? "/comparison" : "#"} onClick={(e) => {
                  if (!currentUser) {
                    e.preventDefault();
                    handleProtectedNavigation('/comparison');
                  }
                }}>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <Scale className="mr-1 h-4 w-4" />
                    Companies Review
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => handleProtectedNavigation('/interview')}
          >
            <Briefcase className="h-4 w-4" />
            <span>Practice Interview</span>
          </Button>
          
          {currentUser ? (
            <>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/notifications')}
              >
                <Bell className="h-5 w-5" />
              </Button>
              
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
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/applications')}>
                    <ClipboardList className="mr-2 h-4 w-4" />
                    My Applications
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" className="flex items-center gap-2" onClick={() => navigate('/signin')}>
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Button>
              <Button onClick={() => navigate('/signup')}>Sign Up</Button>
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

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full neo-blur py-4 px-6 animate-fade-in">
          <nav className="flex flex-col gap-4 mb-4">
            <MobileNavLink to="/" active={location.pathname === '/'}>Home</MobileNavLink>
            
            <MobileNavLink 
              to={currentUser ? "/jobs" : "#"} 
              active={location.pathname === '/jobs'}
              onClick={(e) => {
                if (!currentUser) {
                  e.preventDefault();
                  handleProtectedNavigation('/jobs');
                }
              }}
            >
              Browse Jobs
            </MobileNavLink>
            
            <MobileNavLink 
              to={currentUser ? "/companies" : "#"} 
              active={location.pathname.includes('/companies')}
              onClick={(e) => {
                if (!currentUser) {
                  e.preventDefault();
                  handleProtectedNavigation('/companies');
                }
              }}
            >
              Companies
            </MobileNavLink>
            
            <MobileNavLink 
              to={currentUser ? "/resources" : "#"} 
              active={location.pathname.includes('/resources')}
              onClick={(e) => {
                if (!currentUser) {
                  e.preventDefault();
                  handleProtectedNavigation('/resources');
                }
              }}
            >
              Resources
            </MobileNavLink>
            
            <MobileNavLink 
              to={currentUser ? "/comparison" : "#"} 
              active={location.pathname === '/comparison'}
              onClick={(e) => {
                if (!currentUser) {
                  e.preventDefault();
                  handleProtectedNavigation('/comparison');
                }
              }}
            >
              <div className="flex items-center">
                <Scale className="mr-2 h-4 w-4" />
                Companies Review
              </div>
            </MobileNavLink>
            
            {currentUser && (
              <>
                <MobileNavLink to="/dashboard" active={location.pathname === '/dashboard'}>
                  <div className="flex items-center">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </div>
                </MobileNavLink>
                <MobileNavLink to="/applications" active={location.pathname === '/applications'}>
                  <div className="flex items-center">
                    <ClipboardList className="mr-2 h-4 w-4" />
                    Applications
                  </div>
                </MobileNavLink>
              </>
            )}
          </nav>
          
          <Button 
            variant="outline" 
            className="flex items-center justify-center gap-2 w-full mb-3" 
            onClick={() => {
              handleProtectedNavigation('/interview');
              setMobileMenuOpen(false);
            }}
          >
            <Briefcase className="h-4 w-4" />
            <span>Practice Interview</span>
          </Button>
          
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
                <Button variant="outline" className="flex items-center justify-center gap-2 w-full" onClick={() => navigate('/signin')}>
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Button>
                <Button className="w-full" onClick={() => navigate('/signup')}>Sign Up</Button>
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
  onClick?: (e: React.MouseEvent) => void;
}

const NavLink = ({ to, active, children }: NavLinkProps) => (
  <Link
    to={to}
    className={cn(
      'relative font-medium text-sm transition-colors hover:text-accent',
      active ? 'text-accent' : 'text-foreground/80',
      "after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-accent after:transition-transform after:duration-300",
      active && "after:origin-bottom-left after:scale-x-100"
    )}
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, active, children, onClick }: NavLinkProps) => (
  <Link
    to={to}
    className={cn(
      'py-2 font-medium transition-colors',
      active ? 'text-accent' : 'text-foreground/80'
    )}
    onClick={onClick}
  >
    {children}
  </Link>
);

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default Navbar;
