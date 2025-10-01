import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Business Tycoon - Build Your Empire",
  description: "A strategic business simulation game where you build and manage your corporate empire.",
  keywords: ["Business Tycoon", "Simulation Game", "Strategy", "Management", "Empire Building"],
  authors: [{ name: "Business Tycoon Team" }],
  openGraph: {
    title: "Business Tycoon - Build Your Empire",
    description: "Strategic business simulation game",
    url: "https://businesstycoon.com",
    siteName: "Business Tycoon",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Business Tycoon",
    description: "Build your corporate empire",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
