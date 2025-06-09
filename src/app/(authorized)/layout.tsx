import type { Metadata } from "next";
import "../globals.css";
import ClientSessionCheck from "../clientSession";
import React from 'react'
import { AlertProvider } from "@/components/general/use-alert"; 

// Constants for the app metadata
const APP_NAME = "KALAHI-CIDSS Information System";
const APP_DEFAULT_TITLE = "KCIS";
const APP_TITLE_TEMPLATE = "%s - KCIS";
const APP_DESCRIPTION = "Best PWA app in the world!";

// Metadata for the app
export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <ClientSessionCheck>
      <AlertProvider>
        {children}
      </AlertProvider>
    </ClientSessionCheck>
  );
}
