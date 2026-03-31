import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { VerificationProvider } from "@/components/VerificationContext";
import Header from "@/components/Header";
import RouteLoading from "@/components/RouteLoading";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Web工程师-邓子健",
  description: "这是我的一个个人网站介绍",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <VerificationProvider>
            <RouteLoading />
            <Header />
            <main className="flex-1">{children}</main>
          </VerificationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
