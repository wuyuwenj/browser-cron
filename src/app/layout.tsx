import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Browser Automation Platform",
  description: "Automate web tasks with AI-powered browser automation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
