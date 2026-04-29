import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default: "AI Sales Page Generator",
    template: "%s | AI Sales Page Generator",
  },
  description:
    "Generate high-converting, Shopify-inspired sales pages with AI-powered structure, copy, and design.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "AI Sales Page Generator",
    description:
      "Generate high-converting, Shopify-inspired sales pages with AI-powered structure, copy, and design.",
    siteName: "AI Sales Page Generator",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Sales Page Generator",
    description:
      "Generate high-converting, Shopify-inspired sales pages with AI-powered structure, copy, and design.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-void text-shopify-white font-body flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
