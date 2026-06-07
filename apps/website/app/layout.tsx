import type { Metadata } from 'next';
// import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import SideNav from '@/components/SideNav';

// THIS  IS FOR INTERNET ISSUE
// const geistSans = Geist({
//   variable: '--font-geist-sans',
//   subsets: ['latin'],
// });
//
// const geistMono = Geist_Mono({
//   variable: '--font-geist-mono',
//   subsets: ['latin'],
// });

export const metadata: Metadata = {
  title: 'DomainStalker',
  icons: '/icon.png',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        // THIS  IS FOR INTERNET ISSUE
        //className={`${geistSans.variable} ${geistMono.variable} antialiased lg:flex bg-primary-800 text-primary-50`}
        className="antialiased lg:flex bg-primary-800 text-primary-50"
      >
        <SideNav />
        <div className="lg:w-5/6 overflow-x-hidden w-full lg:border-l border-primary-50/20">
          {children}
        </div>
      </body>
    </html>
  );
}
