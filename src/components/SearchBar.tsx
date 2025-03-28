
import React, { useState } from 'react';
import { Search, MapPin, Briefcase } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface SearchBarProps {
  onSearch?: () => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onSearch) {
      onSearch();
      return;
    }
    
    if (!currentUser) {
      navigate('/signin');
      return;
    }
    
    const searchParams = new URLSearchParams();
    if (query) searchParams.set('q', query);
    if (location) searchParams.set('location', location);
    
    navigate(`/jobs?${searchParams.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="bg-background/80 backdrop-blur-sm rounded-full p-1.5 flex flex-col md:flex-row items-center shadow-lg">
        <div className="flex-1 relative flex items-center w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Job title or keyword"
            className="w-full md:w-auto flex-1 rounded-full border-0 pl-10 py-5 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        
        <div className="h-px md:h-auto md:w-px w-full bg-border my-2 md:my-0 md:mx-2"></div>
        
        <div className="flex-1 relative flex items-center w-full md:w-auto">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Location"
            className="w-full md:w-auto flex-1 rounded-full border-0 pl-10 py-5 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        
        <Button type="submit" className="w-full md:w-auto mt-2 md:mt-0 rounded-full shadow-md">
          <Search className="mr-2 h-4 w-4" />
          <span>Search Jobs</span>
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
