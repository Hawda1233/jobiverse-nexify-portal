
import React from "react";
import { formatDistance } from "date-fns";
import { 
  Clock, 
  Building2, 
  MapPin, 
  CircleCheck, 
  CircleDashed, 
  CircleDot, 
  MoreVertical,
  ExternalLink 
} from "lucide-react";
import { Link } from "react-router-dom";
import { 
  Card, 
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type ApplicationStatus = 
  | "applied" 
  | "screening" 
  | "interview" 
  | "offer" 
  | "rejected" 
  | "accepted";

interface JobApplicationProps {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  appliedDate: Date;
  status: ApplicationStatus;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  onDelete: (id: string) => void;
}

const getStatusColor = (status: ApplicationStatus) => {
  switch (status) {
    case "applied":
      return "bg-blue-100 text-blue-800";
    case "screening":
      return "bg-purple-100 text-purple-800";
    case "interview":
      return "bg-amber-100 text-amber-800";
    case "offer":
      return "bg-green-100 text-green-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    case "accepted":
      return "bg-emerald-100 text-emerald-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: ApplicationStatus) => {
  switch (status) {
    case "applied":
      return <CircleDashed className="w-4 h-4 mr-1" />;
    case "screening":
      return <CircleDot className="w-4 h-4 mr-1" />;
    case "interview":
      return <CircleDot className="w-4 h-4 mr-1" />;
    case "offer":
      return <CircleCheck className="w-4 h-4 mr-1" />;
    case "rejected":
      return <CircleCheck className="w-4 h-4 mr-1" />;
    case "accepted":
      return <CircleCheck className="w-4 h-4 mr-1" />;
    default:
      return <CircleDashed className="w-4 h-4 mr-1" />;
  }
};

const JobApplicationCard = ({
  id,
  jobTitle,
  company,
  location,
  appliedDate,
  status,
  onStatusChange,
  onDelete
}: JobApplicationProps) => {
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{jobTitle}</h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <Building2 className="h-3.5 w-3.5 mr-1" />
              <span>{company}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              <span>{location}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>Applied {formatDistance(appliedDate, new Date(), { addSuffix: true })}</span>
            </div>
          </div>
          
          <Badge className={`${getStatusColor(status)} flex items-center px-2.5 py-0.5`}>
            {getStatusIcon(status)}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4 pb-4">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/jobs/${id}`}>
            <ExternalLink className="h-3.5 w-3.5 mr-1" />
            View Job
          </Link>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => onStatusChange(id, "applied")}
              disabled={status === "applied"}
            >
              Mark as Applied
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onStatusChange(id, "screening")}
              disabled={status === "screening"}
            >
              Mark as Screening
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onStatusChange(id, "interview")}
              disabled={status === "interview"}
            >
              Mark as Interviewing
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onStatusChange(id, "offer")}
              disabled={status === "offer"}
            >
              Mark as Offer Received
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onStatusChange(id, "accepted")}
              disabled={status === "accepted"}
            >
              Mark as Accepted
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onStatusChange(id, "rejected")}
              disabled={status === "rejected"}
            >
              Mark as Rejected
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(id)}
              className="text-destructive"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};

export default JobApplicationCard;
