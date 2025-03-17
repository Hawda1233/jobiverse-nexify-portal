
import React from "react";
import {
  Briefcase,
  CircleCheck,
  Clock,
  Eye,
  MessageSquare,
  Search,
  TrendingUp,
  Trophy
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  footer?: React.ReactNode;
}

const MetricCard = ({
  title,
  value,
  description,
  icon,
  trend,
  footer
}: MetricCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="h-4 w-4 text-muted-foreground">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
      {trend && (
        <div className="flex items-center mt-1">
          <span
            className={`text-xs ${
              trend.isPositive ? "text-green-500" : "text-red-500"
            }`}
          >
            {trend.isPositive ? "+" : "-"}
            {trend.value}%
          </span>
          <TrendingUp
            className={`h-3 w-3 ml-1 ${
              trend.isPositive ? "text-green-500" : "text-red-500"
            }`}
          />
        </div>
      )}
    </CardContent>
    {footer && <CardFooter className="border-t text-xs text-muted-foreground pt-2">{footer}</CardFooter>}
  </Card>
);

const ApplicationMetrics = () => {
  const totalApplications = 12;
  const interviewRate = 42; // percent
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Total Applications"
        value={totalApplications}
        description="Past 30 days"
        icon={<Briefcase className="h-4 w-4" />}
        trend={{ value: 16, isPositive: true }}
        footer="Up from 10 last month"
      />
      
      <MetricCard
        title="Interview Rate"
        value={`${interviewRate}%`}
        description="Applications reaching interview stage"
        icon={<MessageSquare className="h-4 w-4" />}
        trend={{ value: 8, isPositive: true }}
      />
      
      <MetricCard
        title="Profile Views"
        value={28}
        description="Past 30 days"
        icon={<Eye className="h-4 w-4" />}
        trend={{ value: 12, isPositive: true }}
      />
      
      <MetricCard
        title="Time to Response"
        value="3.4 days"
        description="Average employer response time"
        icon={<Clock className="h-4 w-4" />}
        trend={{ value: 5, isPositive: false }}
      />
    </div>
  );
};

const GoalsProgress = () => {
  const goals = [
    { id: 1, name: "Applications", target: 20, current: 12, icon: <Briefcase className="h-4 w-4" /> },
    { id: 2, name: "Interviews", target: 8, current: 5, icon: <MessageSquare className="h-4 w-4" /> },
    { id: 3, name: "Research", target: 15, current: 12, icon: <Search className="h-4 w-4" /> },
    { id: 4, name: "Skills", target: 10, current: 7, icon: <Trophy className="h-4 w-4" /> }
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Monthly Goals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.map(goal => {
          const percentage = Math.round((goal.current / goal.target) * 100);
          return (
            <div key={goal.id} className="space-y-1">
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  {goal.icon}
                  <span className="text-sm font-medium">{goal.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {goal.current}/{goal.target}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={percentage} className="h-2" />
                <span className="text-xs w-9 text-muted-foreground">{percentage}%</span>
              </div>
            </div>
          );
        })}
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="flex items-center justify-between w-full">
          <span className="text-sm text-muted-foreground">Overall progress</span>
          <div className="flex items-center gap-1">
            <CircleCheck className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">On track</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

const DashboardMetrics = () => {
  return (
    <div className="space-y-6">
      <ApplicationMetrics />
      <GoalsProgress />
    </div>
  );
};

export default DashboardMetrics;
