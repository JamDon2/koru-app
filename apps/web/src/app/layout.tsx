import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import Providers from "./providers";
import "@/clients/api";
import AuthCheck from "@/components/auth/AuthCheck";

export const metadata: Metadata = {
  title: "Koru",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang="en" className="dark">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased dark bg-black text-white min-h-screen`}
        >
          <AuthCheck>{children}</AuthCheck>
        </body>
      </html>
    </Providers>
  );
}
