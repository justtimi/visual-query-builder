import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import SidebarRoot from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Query Builder Studio",
  description:
    "A visual query builder for constructing, executing, and simulating complex database filters with real-time preview and results.",
  keywords: [
    "query builder",
    "mongodb filter builder",
    "visual query editor",
    "database UI",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="min-h-full flex">
        <SidebarProvider>
          <div className="flex w-full min-h-screen">
            <SidebarRoot />

            <SidebarInset>
              <SidebarTrigger />
              {children}
            </SidebarInset>
          </div>
        </SidebarProvider>

        <Toaster richColors />
      </body>
    </html>
  );
}
