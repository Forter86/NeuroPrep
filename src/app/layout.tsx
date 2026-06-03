import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthGate } from "@/components/auth/AuthGate";
import { MobileViewportSync } from "@/components/MobileViewportSync";
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
  title: "NeuroPrep — техника безопасности",
  description: "Виртуальный преподаватель по охране труда и ТБ",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex h-full min-h-0 flex-col">
        <MobileViewportSync />
        <AuthGate>{children}</AuthGate>
      </body>
    </html>
  );
}
