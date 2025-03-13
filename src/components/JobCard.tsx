
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from '@/components/ui/card';
import { Bookmark, Clock, DollarSign, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { JobType } from '@/lib/jobsData';

interface JobCardProps {
  job: JobType;
  featured?: boolean;
}

const JobCard = ({ job, featured = false }: JobCardProps) => {
  return (
    <Card 
      className={cn(
        "card-hover overflow-hidden",
        featured && "border-accent/20 relative"
      )}
    >
      {featured && (
        <div className="absolute top-0 right-0">
          <div className="bg-accent text-accent-foreground text-xs font-medium py-1 px-3 rounded-bl-lg">
            Featured
          </div>
        </div>
      )}
      
      <CardHeader className="p-6 flex flex-row items-start gap-4">
        <div 
          className={cn(
            "flex-shrink-0 w-12 h-12 rounded-lg grid place-items-center",
            featured ? "bg-accent/10" : "bg-secondary"
          )}
        >
          <img 
            src={job.companyLogo || "/placeholder.svg"}
            alt={job.companyName}
            className="w-8 h-8 object-contain"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <Link 
              to={`/jobs/${job.id}`}
              className="font-semibold text-lg hover:text-accent line-clamp-1 transition-colors"
            >
              {job.title}
            </Link>
            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <Bookmark className="h-5 w-5" />
              <span className="sr-only">Save job</span>
            </Button>
          </div>
          <div className="text-muted-foreground text-sm">
            {job.companyName}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-6 pb-4">
        <div className="flex flex-wrap gap-3 mb-4">
          <Badge variant="outline" className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {job.location}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {job.jobType}
          </Badge>
          {job.salary && (
            <Badge variant="outline" className="flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5" />
              {job.salary}
            </Badge>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {job.description}
        </p>
      </CardContent>
      
      <CardFooter className="px-6 pb-6 pt-2 flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          Posted {job.postedTime}
        </div>
        <Link to={`/jobs/${job.id}`}>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
