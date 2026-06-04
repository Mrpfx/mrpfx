import type { Metadata } from "next";
import { Inter, DM_Sans, Palanquin_Dark, Nova_Flat } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "./homepage-post.css";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "700"],
  display: "swap",
});

const palanquinDark = Palanquin_Dark({
  subsets: ["latin"],
  variable: "--font-palanquin-dark",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const novaFlat = Nova_Flat({
  subsets: ["latin"],
  variable: "--font-nova-flat",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mr P FX - Master Forex Trading",
  description: "Master forex trading through precision, strategy, and discipline.",
};

import ClientLayout from "./ClientLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${dmSans.variable} ${palanquinDark.variable} ${novaFlat.variable} font-sans bg-black text-white min-h-screen flex flex-col antialiased`}>
        <ClientLayout>
          {children}
        </ClientLayout>
        <Script
          id="tawk-to"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
              var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src='https://embed.tawk.to/679d6d263a84273260786533/1iivf4oa9';
              s1.charset='UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
