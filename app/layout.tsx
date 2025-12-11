import type { Metadata } from "next";
import Script from 'next/script';
import { Inter } from "next/font/google";
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ClientLayout from "@/components/client-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://satkolay.com'),
  title: {
    default: "SatKolay | İkinci Elin En Hızlı Hali",
    template: "%s | SatKolay", // Alt sayfalarda "Hakkımızda | SatKolay" yazar
  },
  description: "Türkiye'nin en hızlı büyüyen ücretsiz ikinci el ilan platformu. Araba, telefon, bilgisayar ve mobilya satmak SatKolay ile çok basit.",
  keywords: ["ikinci el", "satılık", "sahibinden", "diyarbakır ikinci el", "ücretsiz ilan", "sat kolay", "hızlı sat"],
  authors: [{ name: "Burak Basal" }],
  creator: "Burak Basal",
  publisher: "SatKolay",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "SatKolay | İkinci El Alım Satım",
    description: "İhtiyacın olmayanı sat, hayalini ucuza al. Komisyonsuz, hızlı ve güvenli alışverişin adresi.",
    url: 'https://satkolay.com',
    siteName: 'SatKolay',
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "SatKolay",
    description: "İkinci elin en hızlı hali.",
  },
  alternates: {
    canonical: 'https://satkolay.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.className} bg-[#F2F4F5] text-gray-900 antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'SatKolay',
              url: 'https://satkolay.com',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://satkolay.com/arama?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        <ClientLayout>{children}</ClientLayout>
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "ujn11wsda6");
          `}
        </Script>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-033ZYH1VWN"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-033ZYH1VWN');
          `}
        </Script>
      </body>
    </html>
  );
}