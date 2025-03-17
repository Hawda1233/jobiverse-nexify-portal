
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/jobs?search=${searchTerm}&location=${location}&category=${category}`);
  };

  return (
    <form 
      onSubmit={handleSearch} 
      className="w-full max-w-4xl neo-blur rounded-2xl p-2 sm:p-3 animate-fade-in"
    >
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Job title, keyword, or company"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-12 pl-10 pr-4 w-full rounded-xl border-none focus-visible:ring-accent"
          />
        </div>
        
        <div className="relative sm:w-52">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <LocationSelector 
            value={location} 
            onChange={setLocation} 
          />
        </div>
        
        <div className="relative sm:w-52">
          <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <CategorySelector 
            value={category} 
            onChange={setCategory} 
          />
        </div>
        
        <Button 
          type="submit" 
          className="h-12 px-6 rounded-xl flex-shrink-0 transition-all"
        >
          <span className="mr-2">Search</span>
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
};

// Location selector component
const LocationSelector = ({ value, onChange }: { value: string, onChange: (value: string) => void }) => {
  const locations = [
    'Remote', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune', 
    'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Noida', 'Gurgaon', 'Chandigarh', 
    'Kochi', 'Indore', 'Coimbatore', 'Bhubaneswar', 'Guwahati', 'Nagpur'
  ];
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "h-12 w-full pl-10 pr-4 flex items-center justify-between rounded-xl text-left outline-none focus-visible:ring-2 focus-visible:ring-accent bg-background",
            !value && "text-muted-foreground"
          )}
        >
          {value || "Location"}
          <ChevronIndicator />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] max-h-[300px] overflow-auto p-0" align="start">
        <div className="py-1">
          {locations.map((loc) => (
            <button
              key={loc}
              type="button"
              className="w-full px-4 py-2.5 text-left hover:bg-secondary transition-colors"
              onClick={() => onChange(loc)}
            >
              {loc}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

// Category selector component
const CategorySelector = ({ value, onChange }: { value: string, onChange: (value: string) => void }) => {
  const categories = [
    'All Categories', 'Technology', 'Design', 'Marketing', 'Finance', 'Healthcare', 'Education', 'Sales', 'Customer Service'
  ];
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "h-12 w-full pl-10 pr-4 flex items-center justify-between rounded-xl text-left outline-none focus-visible:ring-2 focus-visible:ring-accent bg-background",
            !value && "text-muted-foreground"
          )}
        >
          {value || "Category"}
          <ChevronIndicator />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] max-h-[300px] overflow-auto p-0" align="start">
        <div className="py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className="w-full px-4 py-2.5 text-left hover:bg-secondary transition-colors"
              onClick={() => onChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const ChevronIndicator = () => (
  <svg
    width="12"
    height="6"
    viewBox="0 0 12 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="opacity-50"
  >
    <path
      d="M0.984375 0.984375L6 5.01562L11.0156 0.984375"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SearchBar;
