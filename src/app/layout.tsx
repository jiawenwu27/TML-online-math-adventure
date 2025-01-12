import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TML-Math Adventure",
  description: "A fun family math adventure",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen flex flex-col items-center justify-center border-[45px] border-[#13294B]">
          {/* Top Section with Logo */}
          <div className="absolute top-[5px] left-1/2 transform -translate-x-1/2 bg-[#13294B] px-2">
            <Image
              src="/img/Illinois_logo_fullcolor_rgb_243_351.png"
              alt="University of Illinois Logo"
              className="max-w-full max-h-20 object-contain"
              width={24} // Auto width
              height={35} // Auto height
              priority
            />
          </div>
          {/* Content of the Page */}
          <main className="flex-1 w-full flex items-center justify-center">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
};

export default Layout;