/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MotorInc",
  description: "This is official page of MotorInc Links",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <img
          src="https://images.dog.ceo/breeds/spaniel-welsh/n02102177_3639.jpg"
          alt="Banner description"
        />
      </body>
    </html>
  );
}
