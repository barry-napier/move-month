import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Get user's profile to check role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // Get form data
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const activity_type = formData.get("activity_type") as string;
  const start_date = formData.get("start_date") as string;
  const end_date = formData.get("end_date") as string;
  const target_goal = Number(formData.get("target_goal"));

  // Validate required fields
  if (!title || !activity_type || !start_date || !end_date || !target_goal) {
    return new NextResponse("Missing required fields", { status: 400 });
  }

  // Create challenge
  const { error } = await supabase.from("challenges").insert({
    title,
    description,
    activity_type,
    start_date,
    end_date,
    target_goal,
    created_by: user.id,
  });

  if (error) {
    console.error("Error creating challenge:", error);
    return new NextResponse("Error creating challenge", { status: 500 });
  }

  return new NextResponse("Challenge created successfully", { status: 201 });
}
