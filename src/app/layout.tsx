import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SmartFuel Jordan — National Fuel Intelligence Command",
  description: "AI-Powered National Fuel Intelligence & Command Center — Hashemite Kingdom of Jordan",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-zinc-950 antialiased font-sans">{children}</body>
    </html>
  );
}
