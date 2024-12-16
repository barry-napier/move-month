import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart2,
  Calendar,
  Users,
  CalendarDays,
  LayoutDashboard,
} from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const AuthButtons = user ? (
    <Button size="lg" asChild>
      <Link href="/protected">
        <LayoutDashboard className="mr-2 h-4 w-4" />
        Go to Dashboard
      </Link>
    </Button>
  ) : (
    <div className="flex gap-4 justify-center">
      <Button size="lg" asChild>
        <Link href="/sign-up">
          Get Started <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
      <Button size="lg" variant="outline" asChild>
        <Link href="/sign-in">Sign In</Link>
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <CalendarDays className="h-6 w-6" />
          <span className="ml-2 text-2xl font-bold">Move Month</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#features"
          >
            Features
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#testimonials"
          >
            Testimonials
          </Link>
          {user ? (
            <Link
              className="text-sm font-medium hover:underline underline-offset-4"
              href="/protected"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              className="text-sm font-medium hover:underline underline-offset-4"
              href="#cta"
            >
              Get Started
            </Link>
          )}
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Energize Your Workplace with Move Month
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Boost employee wellness and team spirit through exciting
                  monthly movement challenges.
                </p>
              </div>
              {AuthButtons}
            </div>
          </div>
        </section>
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
        >
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Key Features
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-3 text-center">
                <Calendar className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Monthly Challenges</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Set up diverse movement challenges each month to keep
                  employees engaged.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-3 text-center">
                <Users className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Employee Participation</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Easy activity logging for all types of movement: cycling,
                  running, walking, and more.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-3 text-center">
                <BarChart2 className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Leaderboards</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Foster friendly competition with real-time rankings of all
                  participants.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              What Our Clients Say
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-3 text-center">
                <img
                  src="/placeholder.svg?height=100&width=100"
                  alt="Client"
                  className="rounded-full"
                  width={100}
                  height={100}
                />
                <p className="text-xl font-semibold">
                  "Move Month has transformed our company culture!"
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  - Sarah J., HR Director
                </p>
              </div>
              <div className="flex flex-col items-center space-y-3 text-center">
                <img
                  src="/placeholder.svg?height=100&width=100"
                  alt="Client"
                  className="rounded-full"
                  width={100}
                  height={100}
                />
                <p className="text-xl font-semibold">
                  "Our team is more active and connected than ever."
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  - Mike T., CEO
                </p>
              </div>
              <div className="flex flex-col items-center space-y-3 text-center">
                <img
                  src="/placeholder.svg?height=100&width=100"
                  alt="Client"
                  className="rounded-full"
                  width={100}
                  height={100}
                />
                <p className="text-xl font-semibold">
                  "The leaderboards create such a fun, competitive atmosphere!"
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  - Emily R., Team Lead
                </p>
              </div>
            </div>
          </div>
        </section>
        <section
          id="cta"
          className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Energize Your Workplace?
                </h2>
                <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl">
                  Join Move Month today and start creating a more active,
                  engaged, and connected workforce.
                </p>
              </div>
              {AuthButtons}
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 Move Month. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
