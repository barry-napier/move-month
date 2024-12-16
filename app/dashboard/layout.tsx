import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarDays, BarChart2, User } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card">
        <div className="p-4">
          <Link
            href="/dashboard"
            className="flex items-center space-x-2 text-xl font-bold"
          >
            <CalendarDays className="h-6 w-6" />
            <span>Move Month</span>
          </Link>
        </div>
        <nav className="mt-8">
          <Link
            href="/dashboard"
            className="block py-2 px-4 text-foreground hover:bg-accent"
          >
            <BarChart2 className="inline-block w-5 h-5 mr-2" />
            Dashboard
          </Link>
          <Link
            href="/dashboard/profile"
            className="block py-2 px-4 text-foreground hover:bg-accent"
          >
            <User className="inline-block w-5 h-5 mr-2" />
            Profile
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-8 bg-background">
        {children}
      </main>
    </div>
  );
}
