import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://m92w6vbnwn-jpg.github.io/Pet-adoption-"),
  title: {
    default: "Puppies for Adoption — Find your forever friend",
    template: "%s · Puppies for Adoption",
  },
  description:
    "Puppies for Adoption helps people find forever friends. Browse dogs and puppies looking for loving homes.",
  openGraph: {
    title: "Puppies for Adoption — Find your forever friend",
    description:
      "Puppies for Adoption helps people find forever friends. Browse dogs and puppies looking for loving homes.",
    type: "website",
    siteName: "Puppies for Adoption",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
