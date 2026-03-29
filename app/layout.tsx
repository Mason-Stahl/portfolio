import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WindProvider } from "./contexts/WindContext";
import { TransitionProvider } from "./contexts/TransitionContext";
import AsciiSky from "./components/AsciiSky";
import AmbientBirds from "./components/AmbientBirds";
import PageWrapper from "./components/PageWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mason Stahl",
  description: "Developer portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <WindProvider>
          <TransitionProvider>
            {/* Fixed background layers — persist across all routes */}
            <AsciiSky />
            <AmbientBirds />
            {/* Page content — slides in/out during transitions */}
            <PageWrapper>
              {children}
            </PageWrapper>
          </TransitionProvider>
        </WindProvider>
      </body>
    </html>
  );
}
