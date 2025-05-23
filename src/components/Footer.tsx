
import React from 'react';
import { Link } from 'react-router-dom';
import { BriefcaseBusiness, Facebook, Instagram, Linkedin, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const Footer = () => {
  return (
    <footer className="bg-secondary/50 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <Link to="/" className="flex items-center gap-2 font-bold text-xl mb-4">
              <BriefcaseBusiness className="h-6 w-6 text-accent" />
              <span>Nexify</span>
            </Link>
            <p className="text-muted-foreground mb-6">
              Revolutionizing the way people find their dream careers and employers discover ideal candidates.
            </p>
            <div className="flex gap-4">
              <SocialButton 
                className="bg-black hover:bg-accent"
                onClick={() => window.open('https://x.com', '_blank')}
              >
                <div className="flex items-center justify-center w-full h-full bg-white rounded-full">
                  <svg viewBox="0 0 24 24" className="w-3 h-3 fill-black" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
              </SocialButton>
              <SocialButton icon={<Linkedin className="h-4 w-4" />} />
              <SocialButton icon={<Facebook className="h-4 w-4" />} />
              <SocialButton icon={<Instagram className="h-4 w-4" />} />
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">For Job Seekers</h4>
            <ul className="space-y-3">
              <FooterLink href="/jobs">Browse Jobs</FooterLink>
              <FooterLink href="/companies">Browse Companies</FooterLink>
              <FooterLink href="/resources/resume">Resume Builder</FooterLink>
              <FooterLink href="/resources/career-advice">Career Advice</FooterLink>
              <FooterLink href="/salary-guide">Salary Guide</FooterLink>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">For Employers</h4>
            <ul className="space-y-3">
              <FooterLink href="/employers/post-job">Post a Job</FooterLink>
              <FooterLink href="/employers/talent-search">Talent Search</FooterLink>
              <FooterLink href="/employers/pricing">Pricing</FooterLink>
              <FooterLink href="/employers/resources">Resources</FooterLink>
              <FooterLink href="/employers/success-stories">Success Stories</FooterLink>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  Walchand Institute of Technology<br />
                  Walchand Hirachand Marg<br />
                  Ashok Chowk, Solapur<br />
                  Pin: 413005
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                <a href="mailto:nexify@gmail.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  nexify@gmail.com
                </a>
              </li>
            </ul>
            
            <h4 className="font-medium mb-2 mt-6">Stay Updated</h4>
            <form className="mt-3 space-y-2">
              <Input 
                placeholder="Your email address" 
                className="bg-background"
              />
              <Button className="w-full">Subscribe</Button>
            </form>
          </div>
        </div>
        
        <Separator />
        
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © 2025 Nexify. All rights reserved.
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">About</Link>
            <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

const FooterLink = ({ href, children }: FooterLinkProps) => {
  return (
    <li>
      <Link 
        to={href} 
        className="text-muted-foreground hover:text-foreground transition-colors text-sm"
      >
        {children}
      </Link>
    </li>
  );
};

interface SocialButtonProps {
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

const SocialButton = ({ icon, className, children, onClick }: SocialButtonProps) => {
  return (
    <Button 
      variant="outline" 
      size="icon" 
      className={`h-9 w-9 rounded-full bg-background hover:bg-accent hover:text-white transition-colors ${className || ''}`}
      onClick={onClick}
    >
      {children || icon}
    </Button>
  );
};

export default Footer;
