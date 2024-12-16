import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Medal } from "lucide-react";
import { Database } from "../../types/database.types";
import { AddActivityForm } from "@/components/ui/add-activity-form";

type ActivityWithProfile = {
  distance: number;
  profiles: {
    full_name: string | null;
    department: string | null;
  };
};

type LeaderboardEntry = {
  distance: number;
  name: string | null;
  department: string | null;
};

type Challenge = Database["public"]["Tables"]["challenges"]["Row"];

function calculateTimeProgress(startDate: string, endDate: string): number {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const now = new Date().getTime();

  // If challenge hasn't started yet
  if (now < start) return 0;
  // If challenge has ended
  if (now > end) return 100;

  const totalDuration = end - start;
  const elapsed = now - start;
  return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
}

function calculateDaysLeft(endDate: string): number {
  const end = new Date(endDate).getTime();
  const now = new Date().getTime();
  return Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
}

function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // If in same month and year
  if (
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear()
  ) {
    return start.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  }

  // If different months
  return `${start.toLocaleDateString("en-US", { month: "long" })} - ${end.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get current challenge
  const today = new Date().toISOString();
  const { data: currentChallenge } = await supabase
    .from("challenges")
    .select()
    .lte("start_date", today)
    .gte("end_date", today)
    .single();

  // If there's a current challenge, get the leaderboard and user's total
  let leaderboard: LeaderboardEntry[] | null = null;
  let userTotal = 0;

  if (currentChallenge) {
    // Get user's total distance for this challenge
    const { data: userActivities } = await supabase
      .from("activities")
      .select("distance")
      .eq("challenge_id", currentChallenge.id)
      .eq("user_id", user.id);

    userTotal =
      userActivities?.reduce((sum, activity) => sum + activity.distance, 0) ??
      0;

    // Get leaderboard data
    const { data: leaderboardData } = await supabase.rpc(
      "get_challenge_leaderboard",
      {
        challenge_id: currentChallenge.id,
      }
    );

    if (leaderboardData) {
      leaderboard = leaderboardData.map((entry) => ({
        distance: entry.total_distance,
        name: entry.full_name,
        department: entry.department,
      }));
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {currentChallenge ? (
        <>
          {/* Current Challenge Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                {formatDateRange(
                  currentChallenge.start_date,
                  currentChallenge.end_date
                )}
                : {currentChallenge.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>
                    Month Progress:{" "}
                    {calculateTimeProgress(
                      currentChallenge.start_date,
                      currentChallenge.end_date
                    ).toFixed(0)}
                    %
                  </span>
                  <span>
                    {calculateDaysLeft(currentChallenge.end_date)} days left
                  </span>
                </div>
                <Progress
                  value={calculateTimeProgress(
                    currentChallenge.start_date,
                    currentChallenge.end_date
                  )}
                />
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>
                    Leader:{" "}
                    {leaderboard && leaderboard[0]
                      ? `${leaderboard[0].distance}`
                      : "0"}{" "}
                    / {currentChallenge.target_goal} km
                  </span>
                  <span>{currentChallenge.activity_type}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {currentChallenge.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Add Activity Form */}
          <AddActivityForm
            challengeId={currentChallenge.id}
            activityType={currentChallenge.activity_type}
            startDate={currentChallenge.start_date}
            endDate={currentChallenge.end_date}
            userTotal={userTotal}
            targetGoal={currentChallenge.target_goal}
          />

          {/* Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle>Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {leaderboard?.map((participant, index) => (
                  <div
                    key={`${participant.name ?? "anonymous"}-${index}`}
                    className="flex items-center space-x-4"
                  >
                    <div className="flex-shrink-0 w-8 text-center">
                      {index === 0 && (
                        <Trophy className="w-6 h-6 text-yellow-400 mx-auto" />
                      )}
                      {index === 1 && (
                        <Medal className="w-6 h-6 text-gray-400 mx-auto" />
                      )}
                      {index === 2 && (
                        <Medal className="w-6 h-6 text-amber-600 mx-auto" />
                      )}
                      {index > 2 && (
                        <span className="text-gray-500">{index + 1}</span>
                      )}
                    </div>
                    <Avatar>
                      <AvatarFallback>
                        {participant.name
                          ? participant.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                          : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {participant.name || "Anonymous Athlete"}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {participant.department || "No Department"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {participant.distance.toFixed(1)} km
                      </p>
                      <p className="text-sm text-gray-500">
                        {(
                          (participant.distance /
                            currentChallenge.target_goal) *
                          100
                        ).toFixed(1)}
                        %
                      </p>
                    </div>
                  </div>
                ))}

                {(!leaderboard || leaderboard.length === 0) && (
                  <p className="text-center text-muted-foreground">
                    No activities recorded yet. Be the first to log your
                    activity!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              There is no active challenge at the moment. Check back later or
              ask an admin to create a new challenge.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
