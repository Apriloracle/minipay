import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import { cookieToInitialState } from 'wagmi'
import { config } from "@/utils/config";
import Web3ModalProvider from "@/utils/context";
import Navbar from "@/components/Navbar";
import CpxResearch from "cpx-research-sdk-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Celo App",
  description: "Generated by Nextjs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(config, headers().get('cookie'))
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3ModalProvider initialState={initialState}>
          <CpxResearch
            accentColor="#ff9800"
            appId={process.env.NEXT_PUBLIC_CPX_APP_ID || ""}
            userId="2" // You might want to replace this with a dynamic user ID
            notificationWidget={{
              backgroundColor: "#ff9800",
              height: 60,
              isSingleSurvey: true,
              position: "bottom",
              roundedCorners: 10,
              text: "Click me for surveys",
              textColor: "#ffffff",
              textSize: 18,
              width: 320,
            }}
          />
          <Navbar />
          {children}
        </Web3ModalProvider>
      </body>
    </html>
  );
}
