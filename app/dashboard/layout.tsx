import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarDays, BarChart2, User, Trophy, LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { signOutAction } from "@/app/actions";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card flex flex-col">
        <div className="p-4">
          <Link
            href="/"
            className="flex items-center space-x-2 text-xl font-bold"
          >
            <CalendarDays className="h-6 w-6" />
            <span>Move Month</span>
          </Link>
        </div>
        <nav className="mt-8 flex-1">
          <Link
            href="/dashboard"
            className="block py-2 px-4 text-foreground hover:bg-accent"
          >
            <BarChart2 className="inline-block w-5 h-5 mr-2" />
            Dashboard
          </Link>
          <Link
            href="/dashboard/challenges"
            className="block py-2 px-4 text-foreground hover:bg-accent"
          >
            <Trophy className="inline-block w-5 h-5 mr-2" />
            Challenges
          </Link>
          <Link
            href="/dashboard/profile"
            className="block py-2 px-4 text-foreground hover:bg-accent"
          >
            <User className="inline-block w-5 h-5 mr-2" />
            Profile
          </Link>
        </nav>
        <div className="p-4 border-t">
          <form action={signOutAction}>
            <Button
              variant="ghost"
              className="w-full justify-start"
              type="submit"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sign Out
            </Button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-8 bg-background">
        {children}
      </main>
    </div>
  );
}
