import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Boqzel — Plan, Book & Experience Your Perfect Trip",
  description:
    "Build custom itineraries, book stays, flights, and experiences — all in one platform. Plan your dream trip with Boqzel.",
  keywords: [
    "travel planner",
    "trip booking",
    "hotel booking",
    "flight booking",
    "itinerary builder",
    "vacation planning",
    "Boqzel",
  ],
  openGraph: {
    title: "Boqzel — Plan, Book & Experience Your Perfect Trip",
    description:
      "Build custom itineraries, book stays, flights, and experiences — all in one platform.",
    type: "website",
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="font-inter min-h-full flex flex-col bg-boq-dark-900 text-boq-text-primary">
        <NotificationProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
          <NotificationCenter />
        </NotificationProvider>
      </body>
    </html>
  );
}
