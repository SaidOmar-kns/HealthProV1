import type { Metadata } from "next";
import { Providers } from './providers'
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

import { Inter } from 'next/font/google';

// Configure the Inter font
const inter = Inter({
  subsets: ['latin'], // Specify subsets based on your needs
  variable: '--font-inter', // Optional: for using custom CSS variables
  display: 'swap', // Controls font loading behavior
});

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: `${process.env.NEXT_PUBLIC_APP_NAME}`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} text-gray-600 dark:text-gray-100`}
      >
        <Providers>
          <AuthProvider>{children}</AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
