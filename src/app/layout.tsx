import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DigitSave",
  description: "Savings that helps you build wealth",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-tertiary-7">
      <body className={`${inter.className} font-poppins `}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
