"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Input } from "./input";
import { addActivity } from "@/app/actions/activities";
import { useToast } from "./use-toast";
import { Label } from "./label";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface AddActivityFormProps {
  challengeId: string;
  activityType: string;
  startDate: string;
  endDate: string;
  userTotal: number;
  targetGoal: number;
}

export function AddActivityForm({
  challengeId,
  activityType,
  startDate,
  endDate,
  userTotal,
  targetGoal,
}: AddActivityFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const { toast } = useToast();

  async function action(formData: FormData) {
    setIsSubmitting(true);

    try {
      // Add the date to the form data
      formData.append("activityDate", date.toISOString());

      const result = await addActivity(formData);

      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      } else {
        toast({
          title: "Success",
          description: "Activity added successfully!",
        });
        // Reset the form
        const form = document.querySelector("form") as HTMLFormElement;
        form?.reset();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add activity",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 text-sm text-muted-foreground">
          <div className="flex justify-between mb-2">
            <span>Activity Type: {activityType}</span>
            <span>Your Total: {userTotal.toFixed(1)} km</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2.5">
            <div
              className="bg-primary rounded-full h-2.5 transition-all"
              style={{
                width: `${Math.min(100, (userTotal / targetGoal) * 100)}%`,
              }}
            ></div>
          </div>
          <div className="text-right mt-1">Target: {targetGoal} km</div>
        </div>

        <form action={action} className="space-y-4">
          <input type="hidden" name="challengeId" value={challengeId} />

          <div className="space-y-2">
            <Label htmlFor="distance">Distance (km)</Label>
            <Input
              id="distance"
              type="number"
              name="distance"
              step="0.01"
              min="0"
              placeholder="Enter distance in kilometers"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Activity Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  disabled={(date) => {
                    const startDateTime = new Date(startDate);
                    const endDateTime = new Date(endDate);
                    return (
                      date > new Date() ||
                      date < startDateTime ||
                      date > endDateTime
                    );
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Activity"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
