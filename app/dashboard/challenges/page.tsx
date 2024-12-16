import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateChallengeForm from "./create-challenge-form";
import { CalendarDays, CheckCircle2 } from "lucide-react";

type Challenge = {
  id: string;
  title: string;
  description: string | null;
  activity_type: string;
  target_goal: number;
  start_date: string;
  end_date: string;
};

export default async function ChallengesPage() {
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get user's profile to check role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const today = new Date().toISOString();

  // Get upcoming challenges
  const { data: upcomingChallenges } = await supabase
    .from("challenges")
    .select("*")
    .gt("start_date", today)
    .order("start_date", { ascending: true });

  // Get completed challenges
  const { data: completedChallenges } = await supabase
    .from("challenges")
    .select("*")
    .lt("end_date", today)
    .order("end_date", { ascending: false });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Challenges</h1>

      {/* Only show create challenge form to admins */}
      {profile?.role === "admin" && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Challenge</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateChallengeForm />
          </CardContent>
        </Card>
      )}

      {/* Upcoming Challenges */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays className="h-6 w-6" />
          <h2 className="text-2xl font-semibold">Upcoming Challenges</h2>
        </div>
        <div className="grid gap-6">
          {upcomingChallenges?.map((challenge) => (
            <Card key={challenge.id}>
              <CardHeader>
                <CardTitle>{challenge.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>{challenge.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {challenge.activity_type} • {challenge.target_goal}km
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(challenge.start_date).toLocaleDateString()} -{" "}
                    {new Date(challenge.end_date).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
          {(!upcomingChallenges || upcomingChallenges.length === 0) && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  No upcoming challenges scheduled.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Completed Challenges */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="h-6 w-6" />
          <h2 className="text-2xl font-semibold">Completed Challenges</h2>
        </div>
        <div className="grid gap-6">
          {completedChallenges?.map((challenge) => (
            <Card key={challenge.id}>
              <CardHeader>
                <CardTitle>{challenge.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>{challenge.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {challenge.activity_type} • {challenge.target_goal}km
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(challenge.start_date).toLocaleDateString()} -{" "}
                    {new Date(challenge.end_date).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
          {(!completedChallenges || completedChallenges.length === 0) && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  No completed challenges yet.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
