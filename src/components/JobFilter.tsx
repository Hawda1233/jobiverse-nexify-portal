
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ChevronDown, Filter, X } from 'lucide-react';

// Filter options 
const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship', 'Remote'];
const experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Director', 'Executive'];
const salaryRanges = ['$0 - $50k', '$50k - $100k', '$100k - $150k', '$150k - $200k', '$200k+'];
const industries = ['Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Manufacturing', 'Media'];

const JobFilter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  const clearFilters = () => setActiveFilters([]);
  
  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };
  
  return (
    <div className="neo-blur rounded-xl p-4 h-fit">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </h3>
        {activeFilters.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-sm">
            Clear all
          </Button>
        )}
      </div>
      
      {/* Mobile filter drawer trigger */}
      <div className="lg:hidden w-full mb-4">
        <Button 
          variant="outline" 
          className="w-full justify-between" 
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>Filter Jobs</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
        </Button>
      </div>
      
      <div className={`${isOpen ? "block" : "hidden"} lg:block space-y-6`}>
        {/* Filter section: Job type */}
        <FilterSection title="Job Type">
          <div className="space-y-2">
            {jobTypes.map(type => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox 
                  id={`job-type-${type}`} 
                  checked={activeFilters.includes(type)}
                  onCheckedChange={() => toggleFilter(type)}
                />
                <Label 
                  htmlFor={`job-type-${type}`}
                  className="text-sm cursor-pointer"
                >
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>
        
        {/* Filter section: Experience level */}
        <FilterSection title="Experience Level">
          <div className="space-y-2">
            {experienceLevels.map(level => (
              <div key={level} className="flex items-center space-x-2">
                <Checkbox 
                  id={`exp-${level}`} 
                  checked={activeFilters.includes(level)}
                  onCheckedChange={() => toggleFilter(level)}
                />
                <Label 
                  htmlFor={`exp-${level}`}
                  className="text-sm cursor-pointer"
                >
                  {level}
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>
        
        {/* Filter section: Salary range */}
        <FilterSection title="Salary Range">
          <div className="space-y-2">
            {salaryRanges.map(range => (
              <div key={range} className="flex items-center space-x-2">
                <Checkbox 
                  id={`salary-${range}`} 
                  checked={activeFilters.includes(range)}
                  onCheckedChange={() => toggleFilter(range)}
                />
                <Label 
                  htmlFor={`salary-${range}`}
                  className="text-sm cursor-pointer"
                >
                  {range}
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>
        
        {/* Filter section: Industry */}
        <FilterSection title="Industry">
          <div className="space-y-2">
            {industries.map(industry => (
              <div key={industry} className="flex items-center space-x-2">
                <Checkbox 
                  id={`industry-${industry}`} 
                  checked={activeFilters.includes(industry)}
                  onCheckedChange={() => toggleFilter(industry)}
                />
                <Label 
                  htmlFor={`industry-${industry}`}
                  className="text-sm cursor-pointer"
                >
                  {industry}
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>
        
        {/* Filter section: Sort by */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Sort by</h4>
          <Select defaultValue="relevance">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="salary-high">Highest Salary</SelectItem>
              <SelectItem value="salary-low">Lowest Salary</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Apply filters button (mobile only) */}
        <div className="lg:hidden">
          <Button className="w-full">Apply Filters</Button>
        </div>
      </div>
    </div>
  );
};

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
}

const FilterSection = ({ title, children }: FilterSectionProps) => {
  return (
    <div className="space-y-2">
      <Collapsible defaultOpen>
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">{title}</h4>
          <CollapsibleTrigger className="text-muted-foreground hover:text-foreground">
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
        </div>
        <Separator className="my-2" />
        <CollapsibleContent>
          {children}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default JobFilter;
