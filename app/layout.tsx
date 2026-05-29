import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PostHogProvider } from "@/components/providers/posthog-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MetroScore — Compare U.S. Cities",
    template: "%s | MetroScore",
  },
  description:
    "MetroScore turns housing, population, income, rent, and risk data into a clear city comparison report.",
  keywords: ["city comparison", "real estate", "moving", "home buying", "investment", "MetroScore"],
  metadataBase: new URL("https://metroscore.com"),
  openGraph: {
    title: "MetroScore — Compare U.S. Cities",
    description:
      "Compare U.S. Cities Before You Move, Buy, or Invest. Get a data-driven city comparison report.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
