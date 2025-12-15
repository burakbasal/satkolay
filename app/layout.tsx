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
  metadataBase: new URL('https://www.satkolay.com'),
  title: {
    default: 'İkinci Elin Yeni Adresi - SatKolay',
    template: '%s | SatKolay',
  },
  description: 'Türkiye\'nin en güvenli ve hızlı ikinci el pazar yeri. Araba, telefon, elektronik ve mobilya alım satımının yeni adresi.',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/icon.png', href: '/icon.png' },
      { url: '/icon.png', href: '/icon.png', sizes: '192x192' },
      { url: '/icon.png', href: '/icon.png', sizes: '512x512' },
    ],
    shortcut: '/icon.png',
    apple: '/icon.png',
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/icon.png',
      },
    ],
  },
  openGraph: {
    title: 'İkinci Elin Yeni Adresi - SatKolay',
    description: 'Aradığın her şey SatKolay\'da! İkinci el eşyalarını hemen nakite çevir.',
    url: 'https://www.satkolay.com',
    siteName: 'SatKolay',
    images: [
      {
        url: '/satkolay-resmi-banner.png',
        width: 1200,
        height: 630,
        alt: 'SatKolay Resmi Banner',
      },
    ],
    locale: 'tr_TR',
    type: 'website',
  },
  manifest: '/manifest.webmanifest',
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: 'verification_token',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        'name': 'SatKolay',
        'url': 'https://www.satkolay.com',
        'logo': 'https://www.satkolay.com/satkolay-resmi-logo.jpg',
        'sameAs': [
          'https://www.instagram.com/satkolay',
          'https://twitter.com/satkolay'
        ]
      },
      {
        '@type': 'WebSite',
        'url': 'https://www.satkolay.com',
        'name': 'SatKolay',
        'potentialAction': {
          '@type': 'SearchAction',
          'target': 'https://www.satkolay.com/search?q={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@type': 'ItemList',
        'itemListElement': [
          {
            '@type': 'SiteNavigationElement',
            'position': 1,
            'name': 'Araba',
            'description': 'İkinci El Araba İlanları',
            'url': 'https://www.satkolay.com/search?category=Araba'
          },
          {
            '@type': 'SiteNavigationElement',
            'position': 2,
            'name': 'Telefon',
            'description': 'İkinci El Telefon Modelleri',
            'url': 'https://www.satkolay.com/search?category=Telefon'
          },
          {
            '@type': 'SiteNavigationElement',
            'position': 3,
            'name': 'Elektronik',
            'description': 'Bilgisayar ve Elektronik',
            'url': 'https://www.satkolay.com/search?category=Elektronik'
          },
          {
            '@type': 'SiteNavigationElement',
            'position': 4,
            'name': 'Ev & Yaşam',
            'description': 'Mobilya ve Ev Eşyaları',
            'url': 'https://www.satkolay.com/search?category=Ev'
          }
        ]
      }
    ]
  };

  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${inter.className} bg-white text-gray-900 antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd)
          }}
        />
        <ClientLayout>{children}</ClientLayout>
        <CookieConsent />
        <Script id="microsoft-clarity" strategy="lazyOnload">
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
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
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