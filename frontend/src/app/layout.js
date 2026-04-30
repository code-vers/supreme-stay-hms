import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteShell from "./components/site-shell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "UHMS",
  description: "Supreme Stay Hotel Management System",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang='en'
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className='min-h-full flex flex-col'>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
