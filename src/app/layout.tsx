import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

export const metadata: Metadata = {
  title: "Weather Dashboard",
  description: "Made By Ayush",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
          <TooltipProvider>
            <Toaster />
            <Sonner />
              {children}
          </TooltipProvider>
     
      </body>
    </html>
  );
}
