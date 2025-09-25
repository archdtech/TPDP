import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { RoleProviderWrapper } from "@/components/RoleProviderWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Project Sentinel - AI-Powered TPRM Platform",
  description: "Transform vendor risk assessment from weeks to minutes with explainable AI analysis and secure vendor passport ecosystem.",
  keywords: ["Project Sentinel", "TPRM", "Third-Party Risk Management", "AI", "Risk Assessment", "Vendor Management", "Compliance"],
  authors: [{ name: "Project Sentinel Team" }],
  openGraph: {
    title: "Project Sentinel - AI-Powered TPRM Platform",
    description: "Transform vendor risk assessment from weeks to minutes with explainable AI analysis",
    url: "https://projectsentinel.ai",
    siteName: "Project Sentinel",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Project Sentinel - AI-Powered TPRM Platform",
    description: "Transform vendor risk assessment from weeks to minutes with explainable AI analysis",
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
        <RoleProviderWrapper>
          {children}
          <Toaster />
        </RoleProviderWrapper>
      </body>
    </html>
  );
}
