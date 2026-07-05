import type { Metadata } from "next";
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { HtmlLang } from "@/components/site/html-lang";
import "./globals.css";

const heading = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const body = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://ilmackeria.se",
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" className={`${heading.variable} ${body.variable} h-full`}>
      <body className="min-h-full max-w-[100vw] flex-col antialiased overflow-x-clip flex">
        <HtmlLang />
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
