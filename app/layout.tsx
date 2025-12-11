import type { Metadata } from "next";
import Script from 'next/script';
import { Inter } from "next/font/google";
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ClientLayout from "@/components/client-layout";
import { CookieConsent } from "@/components/cookie-consent";

const inter = Inter({ subsets: ["latin"], display: 'swap' });

export const metadata: Metadata = {
  title: {
    default: 'SatKolay | İkinci Elin Güvenli ve Yeni Adresi',
    template: '%s | SatKolay - İkinci Elin Yeni Adresi'
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  description: 'Türkiye\'nin en hızlı büyüyen ikinci el pazar yeri. Sahibinden araba, telefon, mobilya, elektronik ve giyim ürünlerini ücretsiz ilan vererek kolayca sat veya güvenle al.',
  keywords: [
    'ikinci el', 'satılık', 'sahibinden', 'ücretsiz ilan', 'letgo benzeri',
    'dolap uygulaması', 'güvenli alışveriş', 'online pazar yeri',
    'ikinci el telefon', 'ikinci el araba', 'ikinci el mobilya',
    'hızlı sat', 'sat kolay', 'türkiye ikinci el'
  ],
  authors: [{ name: 'SatKolay Ekibi' }],
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://www.satkolay.com',
    title: 'SatKolay - İkinci El Alışverişin En Kolay Yolu',
    description: 'Aradığın her şey SatKolay\'da! İkinci el eşyalarını hemen nakite çevir.',
    siteName: 'SatKolay',
  },
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.className} bg-white text-gray-900 antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: 'SatKolay',
                url: 'https://www.satkolay.com',
                potentialAction: {
                  '@type': 'SearchAction',
                  target: 'https://www.satkolay.com/search?q={search_term_string}',
                  'query-input': 'required name=search_term_string',
                },
              },
              {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'SatKolay',
                url: 'https://www.satkolay.com',
                logo: 'https://www.satkolay.com/icon.png',
                sameAs: [
                  'https://www.instagram.com/satkolay',
                  'https://twitter.com/satkolay',
                  'https://www.linkedin.com/company/satkolay'
                ]
              }
            ]),
          }}
        />
        <ClientLayout>{children}</ClientLayout>
        <CookieConsent />
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