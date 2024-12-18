"use client";

import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Activity type colors mapping with more vibrant colors and gradients
const activityColors: Record<
  string,
  { bg: string; text: string; gradient: string }
> = {
  running: {
    bg: "bg-rose-100",
    text: "text-rose-700",
    gradient: "from-rose-500/10 to-orange-500/10",
  },
  walking: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    gradient: "from-emerald-500/10 to-teal-500/10",
  },
  cycling: {
    bg: "bg-sky-100",
    text: "text-sky-700",
    gradient: "from-sky-500/10 to-blue-500/10",
  },
  swimming: {
    bg: "bg-cyan-100",
    text: "text-cyan-700",
    gradient: "from-cyan-500/10 to-blue-500/10",
  },
  hiking: {
    bg: "bg-violet-100",
    text: "text-violet-700",
    gradient: "from-violet-500/10 to-purple-500/10",
  },
  default: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    gradient: "from-slate-500/10 to-gray-500/10",
  },
};

type Activity = {
  id: string;
  created_at: string;
  distance: number;
  activity_type: string;
  challenge_id: string;
  user_id: string;
};

export function ActivitiesList({
  activities = [],
  currentChallengeId,
}: {
  activities: Activity[];
  currentChallengeId?: string;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  // Get activity color
  const getActivityColor = (type: string) => {
    return activityColors[type.toLowerCase()] || activityColors.default;
  };

  // Safely get unique activity types and sort them
  const activityTypes = [
    "all",
    ...Array.from(
      new Set(activities?.map((a) => a.activity_type) ?? [])
    ).sort(),
  ];

  // Filter activities based on search and type
  const filteredActivities =
    activities?.filter((activity) => {
      if (!activity) return false;

      const matchesSearch =
        activity.activity_type
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        new Date(activity.created_at)
          .toLocaleDateString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        activity.distance.toString().includes(searchTerm);

      const matchesType =
        selectedType === "all" || activity.activity_type === selectedType;

      return matchesSearch && matchesType;
    }) ?? [];

  // Group filtered activities by month and year
  const groupedActivities = filteredActivities.reduce(
    (groups, activity) => {
      if (!activity?.created_at) return groups;

      const date = new Date(activity.created_at);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(activity);
      return groups;
    },
    {} as Record<string, Activity[]>
  );

  // Sort groups by date (newest first)
  const sortedGroups = Object.entries(groupedActivities).sort((a, b) =>
    b[0].localeCompare(a[0])
  );

  // If no activities, show empty state
  if (!activities?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No activities recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search activities..."
            className="w-full pl-8 pr-3 py-2 border rounded-md bg-white/50 focus:bg-white transition-all hover:border-slate-400 focus:ring-2 focus:ring-slate-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-[200px]">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="bg-white/50 hover:bg-white transition-all hover:border-slate-400">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Filter by type" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {activityTypes.map((type) => (
                <SelectItem
                  key={type}
                  value={type}
                  className={cn(
                    type !== "all" && getActivityColor(type).text,
                    "font-medium"
                  )}
                >
                  {type === "all"
                    ? "All activities"
                    : type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="text-sm text-muted-foreground mb-4">
        Showing {filteredActivities.length} of {activities.length} activities
        {selectedType !== "all" && (
          <span
            className={cn(
              "font-medium ml-1",
              getActivityColor(selectedType).text
            )}
          >
            • Filtered by {selectedType}
          </span>
        )}
      </div>

      <div className="space-y-8">
        {sortedGroups.map(([dateKey, groupActivities]) => {
          const [year, month] = dateKey.split("-");
          const monthName = new Date(
            parseInt(year),
            parseInt(month)
          ).toLocaleDateString("en-US", { month: "long" });

          return (
            <div key={dateKey} className="space-y-4">
              <h3 className="font-semibold text-lg sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2 z-10 border-b">
                {monthName} {year}
              </h3>
              <div className="space-y-3">
                {groupActivities.map((activity) => {
                  const colors = getActivityColor(activity.activity_type);
                  return (
                    <div
                      key={activity.id}
                      className={cn(
                        "flex justify-between items-center py-3 px-4 border rounded-lg transition-all duration-200",
                        "hover:border-slate-300 hover:shadow-sm hover:bg-gradient-to-br",
                        "bg-white/80",
                        colors.gradient
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "h-14 w-14 rounded-full flex items-center justify-center shadow-sm transition-transform duration-200",
                            "hover:scale-105",
                            colors.bg
                          )}
                        >
                          <span
                            className={cn("text-xl font-bold", colors.text)}
                          >
                            {activity.distance.toFixed(1)}
                          </span>
                        </div>
                        <div>
                          <p
                            className={cn(
                              "font-medium flex items-center gap-2",
                              colors.text
                            )}
                          >
                            {activity.activity_type}
                            <span className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full">
                              km
                            </span>
                          </p>
                          <p className="text-sm text-slate-500">
                            {new Date(activity.created_at).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={cn(
                            "text-xs px-2.5 py-1 rounded-full font-medium transition-colors",
                            activity.challenge_id === currentChallengeId
                              ? "bg-emerald-100 text-emerald-700 shadow-sm"
                              : "bg-slate-100 text-slate-600"
                          )}
                        >
                          {activity.challenge_id === currentChallengeId
                            ? "Current Challenge"
                            : "Past Challenge"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {filteredActivities.length === 0 && (
          <div className="text-center py-12 px-4">
            <div className="max-w-sm mx-auto">
              <p className="text-slate-500 bg-slate-50 rounded-lg py-4">
                No activities found matching your search.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
