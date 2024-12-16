import { Suspense } from "react";
import Link from "next/link";

function NotFoundContent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <h1 className="text-4xl font-bold">404</h1>
      <h2 className="text-xl">Page Not Found</h2>
      <p className="text-muted-foreground">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Suspense fallback={<div>Loading...</div>}>
        <Link
          href="/"
          className="text-primary hover:text-primary/90 underline underline-offset-4"
        >
          Go back home
        </Link>
      </Suspense>
    </div>
  );
}

export default function NotFound() {
  return <NotFoundContent />;
}
