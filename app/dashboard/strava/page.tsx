import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { formatDistanceToNow, format } from "date-fns";
import { ConnectStravaButton } from "./components/connect-button";
import { SyncStravaButton } from "./components/sync-button";

interface Activity {
  id: string;
  user_id: string;
  challenge_id: string | null;
  activity_type: string;
  distance: number;
  duration: number;
  activity_date: string;
  created_at: string;
  updated_at: string;
}

async function getActivities() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: activities } = await supabase
    .from("activities")
    .select("*, challenges(name)")
    .order("activity_date", { ascending: false });

  return activities as
    | (Activity & { challenges: { name: string } | null })[]
    | null;
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

function getErrorMessage(error: string, details?: string): string {
  if (error === "access_denied") {
    return "You denied access to your Strava account. Please try again and click 'Authorize' to connect your account.";
  }
  if (error === "no_code") {
    return "No authorization code received from Strava. Please try again.";
  }
  if (error === "token_exchange_failed") {
    return `Failed to connect to Strava. ${details ? `Error: ${details}` : "Please try again."}`;
  }
  return "An unknown error occurred. Please try again.";
}

export default async function StravaPage() {
  const activities = await getActivities();
  const hasActivities = activities && activities.length > 0;

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Strava Connection</CardTitle>
          {hasActivities && <SyncStravaButton />}
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          {!hasActivities ? (
            <>
              <p className="text-muted-foreground">
                Connect your Strava account to automatically sync your
                activities.
              </p>
              <ConnectStravaButton />
            </>
          ) : (
            <div className="w-full">
              <div className="flex items-center gap-2 mb-6">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <p className="text-sm text-muted-foreground">
                  Connected to Strava
                </p>
              </div>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <Card key={activity.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <div>
                            <h3 className="font-semibold capitalize">
                              {activity.activity_type
                                .toLowerCase()
                                .replace("_", " ")}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {format(
                                new Date(activity.activity_date),
                                "MMM d, yyyy"
                              )}{" "}
                              (
                              {formatDistanceToNow(
                                new Date(activity.activity_date),
                                { addSuffix: true }
                              )}
                              )
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {activity.distance.toFixed(2)} km
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatDuration(activity.duration)}
                          </p>
                        </div>
                      </div>
                      {activity.challenges && (
                        <div className="mt-2 text-sm">
                          <span className="text-muted-foreground">
                            Challenge:
                          </span>{" "}
                          <span className="font-medium">
                            {activity.challenges.name}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
