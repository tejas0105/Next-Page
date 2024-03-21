/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MotorInc",
  description: "This is official page of MotorInc Links",
  openGraph: {
    images:
      "https://yt3.googleusercontent.com/p_DX_kH6yfovXKdqA1dW-rxKdosAjwuHWXObz9GW_AD-mTdehKNZNzu8vko81eiV4Wi3sxQogg=s176-c-k-c0x00ffffff-no-rj",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
