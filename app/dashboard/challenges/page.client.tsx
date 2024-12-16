"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateChallengeForm from "./create-challenge-form";
import { useEffect, useState } from "react";
import { createClient } from "@/app/utils/supabase-client";

type Challenge = {
  id: string;
  title: string;
  description: string | null;
  activity_type: string;
  target_goal: number;
  start_date: string;
  end_date: string;
};

type Profile = {
  role: string;
};

export default function ChallengesPageClient() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();

      // Get user's profile to check role
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      setProfile(profileData);

      // Get existing challenges
      const { data: challengesData } = await supabase
        .from("challenges")
        .select("*")
        .order("created_at", { ascending: false });

      if (challengesData) {
        setChallenges(challengesData);
      }

      setIsLoading(false);
    }

    loadData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

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

      {/* Display existing challenges */}
      <div className="grid gap-6">
        {challenges.map((challenge) => (
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
      </div>
    </div>
  );
}
