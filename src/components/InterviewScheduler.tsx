
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  candidateName: z.string().min(2, {
    message: "Candidate name must be at least 2 characters.",
  }),
  candidateEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  jobTitle: z.string().min(2, {
    message: "Job title is required.",
  }),
  date: z.date({
    required_error: "Interview date is required.",
  }),
  time: z.string().min(1, {
    message: "Interview time is required.",
  }),
  duration: z.string().min(1, {
    message: "Duration is required.",
  }),
  interviewType: z.enum(["technical", "behavioral", "general", "leadership"], {
    required_error: "Please select an interview type.",
  }),
  notes: z.string().optional(),
});

export type InterviewData = z.infer<typeof formSchema>;

interface InterviewSchedulerProps {
  onSchedule: (data: InterviewData) => void;
  onCancel: () => void;
  jobOptions: { id: number; title: string }[];
}

const InterviewScheduler: React.FC<InterviewSchedulerProps> = ({
  onSchedule,
  onCancel,
  jobOptions,
}) => {
  const { toast } = useToast();
  const form = useForm<InterviewData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      candidateName: "",
      candidateEmail: "",
      jobTitle: "",
      time: "",
      duration: "60",
      interviewType: "general",
      notes: "",
    },
  });

  const onSubmit = (data: InterviewData) => {
    onSchedule(data);
    toast({
      title: "Interview Scheduled",
      description: `Interview with ${data.candidateName} scheduled for ${format(data.date, "PPP")} at ${data.time}`,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="candidateName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Candidate Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="candidateEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Candidate Email</FormLabel>
                <FormControl>
                  <Input placeholder="candidate@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Position</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a job position" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {jobOptions.map((job) => (
                      <SelectItem key={job.id} value={job.title}>
                        {job.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="interviewType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interview Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select interview type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="behavioral">Behavioral</SelectItem>
                    <SelectItem value="leadership">Leadership</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Interview Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interview Time</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <Clock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                    <SelectItem value="120">120 minutes</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional information for the candidate..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Include any specific instructions or preparation tips for the candidate.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Schedule Interview</Button>
        </div>
      </form>
    </Form>
  );
};

export default InterviewScheduler;
