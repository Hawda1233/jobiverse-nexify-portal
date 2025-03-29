
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Search, MapPin, Briefcase, Zap, BrainCircuit, Box, Bell, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SearchBar from './SearchBar';
import ImageWithFallback from './ImageWithFallback';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Company logo mapping
const companyLogos: Record<string, string> = {
  Tesla: "/logos/tesla.svg",
  Microsoft: "/logos/microsoft.svg",
  Google: "/logos/google.svg",
  Apple: "/logos/apple.svg"
};

// Mock notifications data
const initialNotifications = [
  {
    id: 1,
    title: "New Job Match",
    message: "We found a new job matching your skills: Senior React Developer at Google",
    time: "10 minutes ago",
    read: false
  },
  {
    id: 2,
    title: "Application Update",
    message: "Your application at Microsoft has moved to the interview stage",
    time: "1 hour ago",
    read: false
  },
  {
    id: 3,
    title: "Profile Viewed",
    message: "A recruiter from Tesla viewed your profile",
    time: "Yesterday",
    read: false
  }
];

const Hero = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(initialNotifications.length);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Update unread count when notifications change
  useEffect(() => {
    const count = notifications.filter(notification => !notification.read).length;
    setUnreadCount(count);
  }, [notifications]);

  // Handle opening the notification dropdown
  const handleOpenNotifications = () => {
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to view your notifications",
        variant: "default",
      });
      return;
    }
    setIsDropdownOpen(true);
  };

  // Handle closing the notification dropdown
  const handleCloseNotifications = () => {
    // Mark all as read when dropdown closes
    if (isDropdownOpen) {
      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        read: true
      }));
      setNotifications(updatedNotifications);
      setUnreadCount(0);
    }
    setIsDropdownOpen(false);
  };

  // Handle clicking on a notification
  const handleNotificationClick = (id: number) => {
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to interact with notifications",
        variant: "default",
      });
      return;
    }
    
    // Mark specific notification as read
    const updatedNotifications = notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
    
    // Show a toast to simulate navigation
    toast({
      title: "Notification viewed",
      description: "Navigating to the related content...",
    });
  };

  // Handle search functionality
  const handleSearch = () => {
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to search for jobs",
        variant: "default",
      });
      return;
    }
    navigate('/jobs');
  };

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Abstract background shapes */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 bg-accent/5 w-[800px] h-[800px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 bg-secondary w-[600px] h-[600px] rounded-full -translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/4 left-1/4 bg-primary/5 w-[300px] h-[300px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        {/* Notification System */}
        <div className="absolute top-4 right-4 z-10">
          <DropdownMenu open={isDropdownOpen} onOpenChange={open => {
            if (open) handleOpenNotifications();
            else handleCloseNotifications();
          }}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-[10px] text-white font-bold">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            {currentUser && (
              <DropdownMenuContent className="w-80 mt-2" align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <DropdownMenuItem 
                        key={notification.id}
                        className={`cursor-pointer p-3 ${!notification.read ? 'bg-accent/10' : ''}`}
                        onClick={() => handleNotificationClick(notification.id)}
                      >
                        <div className="flex flex-col space-y-1">
                          <div className="flex justify-between items-center">
                            <p className="font-medium">{notification.title}</p>
                            <span className="text-xs text-muted-foreground">{notification.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                        </div>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="p-3 text-center text-muted-foreground">
                      No new notifications
                    </div>
                  )}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer justify-center">
                  See all notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="inline-flex items-center bg-accent/10 text-accent rounded-full px-3 py-1 text-sm font-medium mb-6"
          >
            <span className="animate-pulse-subtle">Revolutionizing job search</span>
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance"
          >
            Nexify: Where Talent Meets Opportunities
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-lg text-muted-foreground mb-10 max-w-3xl mx-auto text-balance"
          >
            Nexify uses cutting-edge AI, blockchain verification and AR interview technology to match your skills with the perfect opportunities, elevating your career journey.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="w-full"
          >
            <SearchBar onSearch={handleSearch} />
            {!currentUser && (
              <div className="mt-2 text-sm text-muted-foreground flex items-center justify-center gap-2">
                <LogIn className="h-4 w-4" />
                <span>Sign in to search and apply for jobs</span>
              </div>
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-4 mt-8 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-1.5">
              <Briefcase className="h-4 w-4" />
              <span>10,000+ jobs available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <span>Remote & in-office opportunities</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Search className="h-4 w-4" />
              <span>AI-powered matching</span>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full"
          >
            <div className="neo-blur rounded-xl p-5 flex flex-col items-center text-center card-hover">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <BrainCircuit className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-medium mb-1">AI Matching</h3>
              <p className="text-sm text-muted-foreground">Smart algorithms that understand your true potential</p>
              {!currentUser && (
                <div className="mt-2 text-xs text-accent flex items-center">
                  <LogIn className="h-3 w-3 mr-1" />
                  <span>Sign in to use</span>
                </div>
              )}
            </div>
            <div className="neo-blur rounded-xl p-5 flex flex-col items-center text-center card-hover">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Box className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-medium mb-1">AR/VR Interviews</h3>
              <p className="text-sm text-muted-foreground">Practice and perform in immersive environments</p>
              {!currentUser && (
                <div className="mt-2 text-xs text-accent flex items-center">
                  <LogIn className="h-3 w-3 mr-1" />
                  <span>Sign in to use</span>
                </div>
              )}
            </div>
            <div className="neo-blur rounded-xl p-5 flex flex-col items-center text-center card-hover">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Zap className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-medium mb-1">Blockchain Verified</h3>
              <p className="text-sm text-muted-foreground">Secure, transparent credential verification</p>
              {!currentUser && (
                <div className="mt-2 text-xs text-accent flex items-center">
                  <LogIn className="h-3 w-3 mr-1" />
                  <span>Sign in to use</span>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="mt-16 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          {['Tesla', 'Microsoft', 'Google', 'Apple'].map((company, index) => (
            <motion.div 
              key={company}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 + index * 0.1, duration: 0.5 }}
              className="flex flex-col items-center justify-center p-4 neo-blur rounded-lg text-muted-foreground font-medium animate-float h-36"
            >
              <div className="h-20 w-full flex items-center justify-center mb-2">
                <img 
                  src={companyLogos[company]} 
                  alt={`${company} logo`}
                  className="h-16 w-auto max-w-full object-contain"
                />
              </div>
              <span className="text-xs">{company}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
