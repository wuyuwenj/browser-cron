import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BrowserCron",
  description: "Schedule AI agents to browse the web for you - automate any website with natural language",
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
