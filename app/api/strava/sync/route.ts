import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { StravaActivity } from "@/app/dashboard/strava/types";

export async function POST() {
  try {
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the user's Strava connection
    const { data: stravaConnection } = await supabase
      .from("strava_connections")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!stravaConnection) {
      return new NextResponse("No Strava connection found", { status: 404 });
    }

    // Check if token needs refresh
    const now = new Date();
    const tokenExpiry = new Date(stravaConnection.expires_at);
    let accessToken = stravaConnection.access_token;

    if (tokenExpiry <= now) {
      // Refresh the token
      const response = await fetch("https://www.strava.com/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID,
          client_secret: process.env.STRAVA_CLIENT_SECRET,
          refresh_token: stravaConnection.refresh_token,
          grant_type: "refresh_token",
        }),
      });

      if (!response.ok) {
        return new NextResponse("Failed to refresh token", { status: 500 });
      }

      const tokenData = await response.json();
      accessToken = tokenData.access_token;

      // Update the tokens in the database
      await supabase
        .from("strava_connections")
        .update({
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          expires_at: new Date(tokenData.expires_at * 1000).toISOString(),
        })
        .eq("user_id", user.id);
    }

    // Get the current challenge
    const { data: currentChallenge } = await supabase
      .from("challenges")
      .select("id")
      .gte("end_date", new Date().toISOString())
      .lte("start_date", new Date().toISOString())
      .single();

    // Fetch activities from Strava
    const activitiesResponse = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?per_page=30`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!activitiesResponse.ok) {
      return new NextResponse("Failed to fetch activities", { status: 500 });
    } else {
      console.log("Activities fetched successfully: ", activitiesResponse);
    }

    const stravaActivities: StravaActivity[] = await activitiesResponse.json();

    // Map Strava activities to your schema
    const mappedActivities = stravaActivities.map((activity) => ({
      user_id: user.id,
      challenge_id: currentChallenge?.id || null,
      activity_type: activity.type,
      distance: activity.distance / 1000, // Convert to kilometers
      duration: activity.moving_time, // Duration in seconds
      activity_date: new Date(activity.start_date).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    // Store activities in Supabase
    const { error: activitiesError } = await supabase
      .from("activities")
      .upsert(mappedActivities);

    if (activitiesError) {
      return new NextResponse("Failed to store activities", { status: 500 });
    }

    return new NextResponse("Activities synced successfully", { status: 200 });
  } catch (error) {
    console.error("Error syncing activities:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
