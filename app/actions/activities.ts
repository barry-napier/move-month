"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addActivity(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to add activities" };
  }

  const distance = parseFloat(formData.get("distance") as string);
  const challengeId = formData.get("challengeId") as string;
  const activityDate = new Date(formData.get("activityDate") as string);

  if (isNaN(distance) || distance <= 0) {
    return { error: "Please enter a valid distance" };
  }

  if (isNaN(activityDate.getTime())) {
    return { error: "Please select a valid date" };
  }

  // Get the challenge to validate dates and get activity_type
  const { data: challenge, error: challengeError } = await supabase
    .from("challenges")
    .select("activity_type, start_date, end_date")
    .eq("id", challengeId)
    .single();

  if (challengeError || !challenge) {
    console.error("Error fetching challenge:", challengeError);
    return { error: "Failed to fetch challenge details" };
  }

  // Validate activity date is within challenge period
  const startDate = new Date(challenge.start_date);
  const endDate = new Date(challenge.end_date);

  if (activityDate < startDate || activityDate > endDate) {
    return { error: "Activity date must be within the challenge period" };
  }

  const now = new Date();
  const { error } = await supabase.from("activities").insert({
    user_id: user.id,
    challenge_id: challengeId,
    activity_type: challenge.activity_type,
    distance: distance,
    activity_date: activityDate.toISOString(),
    created_at: now.toISOString(),
  });

  if (error) {
    console.error("Error adding activity:", error);
    return { error: "Failed to add activity" };
  }

  // Force revalidation of all dashboard routes
  revalidatePath("/dashboard", "layout");
  revalidatePath("/", "layout");

  return { success: true };
}
