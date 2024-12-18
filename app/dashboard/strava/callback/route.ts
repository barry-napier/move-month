import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { StravaActivity } from "../types";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = await requestUrl.searchParams.get("code");
  const error = await requestUrl.searchParams.get("error");

  if (error) {
    console.error("Strava authorization error:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/strava?error=access_denied`
    );
  }

  if (!code) {
    console.error("No authorization code received from Strava");
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/strava?error=no_code`
    );
  }

  try {
    // Validate required environment variables
    const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
    const clientSecret = process.env.STRAVA_CLIENT_SECRET;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!clientId || !clientSecret || !baseUrl) {
      console.error("Missing required environment variables:", {
        hasClientId: !!clientId,
        hasClientSecret: !!clientSecret,
        hasBaseUrl: !!baseUrl,
      });
      throw new Error("Missing required environment variables");
    }

    // Exchange the authorization code for tokens
    const tokenResponse = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange code for token");
    }

    const tokenData = await tokenResponse.json();

    // Get the current user from Supabase
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Failed to get user:", userError);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/sign-in`
      );
    }

    // Get the current challenge
    const { data: currentChallenge } = await supabase
      .from("challenges")
      .select("id")
      .gte("end_date", new Date().toISOString())
      .lte("start_date", new Date().toISOString())
      .single();

    // Use token to call Strava API to get activities
    const activitiesResponse = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?per_page=30`,
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    if (!activitiesResponse.ok) {
      throw new Error("Failed to fetch activities from Strava");
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
      throw activitiesError;
    }

    // Redirect to success page
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/strava?message=activities_synced`
    );
  } catch (err) {
    console.error("Error in Strava callback:", err);
    const errorMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/strava?error=token_exchange_failed&details=${encodeURIComponent(errorMessage)}`
    );
  }
}
