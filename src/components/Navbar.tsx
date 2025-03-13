
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu, X, User, BriefcaseBusiness, Bell, LogOut } from 'lucide-react';
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

const Navbar = () => {
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

        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/" active={location.pathname === '/'}>Home</NavLink>
          <NavLink to="/jobs" active={location.pathname === '/jobs'}>Browse Jobs</NavLink>
          <NavLink to="/companies" active={location.pathname.includes('/companies')}>Companies</NavLink>
          <NavLink to="/resources" active={location.pathname.includes('/resources')}>Resources</NavLink>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
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
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/applications')}>
                  My Applications
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
              <Button variant="outline" className="flex items-center gap-2" onClick={() => navigate('/signin')}>
                <User className="h-4 w-4" />
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
            <MobileNavLink to="/jobs" active={location.pathname === '/jobs'}>Browse Jobs</MobileNavLink>
            <MobileNavLink to="/companies" active={location.pathname.includes('/companies')}>Companies</MobileNavLink>
            <MobileNavLink to="/resources" active={location.pathname.includes('/resources')}>Resources</MobileNavLink>
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
                <Button variant="outline" className="flex items-center justify-center gap-2 w-full" onClick={() => navigate('/signin')}>
                  <User className="h-4 w-4" />
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

export default Navbar;
