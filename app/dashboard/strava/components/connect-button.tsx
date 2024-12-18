"use client";

import { Button } from "@/components/ui/button";

export function ConnectStravaButton() {
  const handleConnect = () => {
    const STRAVA_CLIENT_ID = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const STRAVA_REDIRECT_URI = `${BASE_URL}/dashboard/strava/callback`;
    const STRAVA_SCOPE = "read,activity:read_all,profile:read_all";

    const authUrl = `https://www.strava.com/oauth/authorize?client_id=${STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(STRAVA_REDIRECT_URI)}&approval_prompt=force&scope=${STRAVA_SCOPE}`;
    window.location.href = authUrl;
  };

  return (
    <Button
      onClick={handleConnect}
      className="bg-[#FC4C02] hover:bg-[#FC4C02]/90 text-white"
    >
      Connect with Strava
    </Button>
  );
}
