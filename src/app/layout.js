import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Script from "next/script";

// Loading Minimalist Fonts
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata = {
  title: "Murlidhar Studio - Premium Photography in Kutch",
  description: "Minimalist, professional photography and videography services in Kutch.",
  keywords: "photography, videography, wedding photography, pre-wedding, engagement, child photography, maternity shoot, cinematic videos, professional photographer, Murlidhar Studio, Kutch",
};

export const viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning={true}>
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        
        {/* Google Analytics */}
        <Script 
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} 
          strategy="afterInteractive" 
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>

        {/* JSON-LD for Organization & WebSite */}
        <Script id="json-ld-organization" type="application/ld+json" strategy="afterInteractive">
          {`
            {"@context":"https://schema.org","@type":"Organization","name":"Murlidhar Studio","url":"https://murlidharstudio.com","logo":"https://murlidharstudio.com/favicon.png"}
          `}
        </Script>
        <Script id="json-ld-website" type="application/ld+json" strategy="afterInteractive">
          {`
            {"@context":"https://schema.org","@type":"WebSite","name":"Murlidhar Studio","url":"https://murlidharstudio.com"}
          `}
        </Script>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
