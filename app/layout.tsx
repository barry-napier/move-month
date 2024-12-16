import "@/app/globals.css";
import { GeistSans } from "geist/font/sans";
import { Providers } from "@/components/providers";
import { MessageToast } from "@/components/message-toast";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Move Month",
  description: "Monthly fitness challenges for your workplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">
        <Providers>
          <Suspense>
            <MessageToast />
          </Suspense>

          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
