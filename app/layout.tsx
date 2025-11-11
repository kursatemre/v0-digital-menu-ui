import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google"
import "./globals.css"
import ClientLayout from "./client-layout"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

// Playfair Display for Classic Elegance theme
export const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL('https://menumgo.digital'),
  title: {
    default: 'MenuMGO - Dijital QR Menü Sistemi | Ücretsiz Dene',
    template: '%s | MenuMGO'
  },
  description: 'QR kodlu dijital menü çözümü. Restoran, kafe ve oteller için çoklu dil destekli, kolay yönetilebilir dijital menü sistemi. 3 gün ücretsiz deneyin!',
  keywords: [
    'dijital menü', 'qr menü', 'qr kod menü', 'restoran menüsü', 'cafe menüsü', 
    'online menü', 'menumgo', 'dijital restoran menüsü', 'qr menu', 'digital menu',
    'restoran qr kod', 'kafe qr menü', 'otel menüsü', 'çoklu dil menü',
    'multilingual menu', 'touchless menu', 'temassız menü', 'akıllı menü',
    'mobil menü', 'web menü', 'restoran dijitalleşme', 'menü yönetim sistemi'
  ],
  authors: [{ name: 'MenuMGO', url: 'https://menumgo.digital' }],
  creator: 'MenuMGO',
  publisher: 'MenuMGO',
  generator: 'MenuMGO Platform',
  applicationName: 'MenuMGO',
  alternates: {
    canonical: 'https://menumgo.digital',
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    alternateLocale: ['en_US'],
    url: 'https://menumgo.digital',
    title: 'MenuMGO - Dijital QR Menü Sistemi | 3 Gün Ücretsiz',
    description: 'Çoklu dil destekli QR kodlu dijital menü sistemi. Restoran, kafe ve oteller için profesyonel çözüm. Kolay kurulum, hızlı sipariş alma.',
    siteName: 'MenuMGO',
    images: [
      {
        url: '/meta/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MenuMGO - Dijital QR Menü Sistemi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MenuMGO - Dijital QR Menü Sistemi',
    description: 'Çoklu dil destekli QR kodlu dijital menü. 3 gün ücretsiz deneyin!',
    creator: '@menumgo',
    images: ['/meta/twitter-image.png'],
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
  verification: {
    google: 'your-google-verification-code',
  },
  category: 'technology',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "MenuMGO",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "TRY",
      "priceValidUntil": "2025-12-31",
      "description": "3 gün ücretsiz deneme"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "150"
    },
    "description": "QR kodlu dijital menü sistemi. Restoran, kafe ve oteller için çoklu dil destekli, kolay yönetilebilir dijital menü çözümü.",
    "image": "https://menumgo.digital/meta/og-image.png",
    "url": "https://menumgo.digital",
    "author": {
      "@type": "Organization",
      "name": "MenuMGO"
    },
    "features": [
      "QR Kod Menü Oluşturma",
      "Çoklu Dil Desteği (Türkçe/İngilizce)",
      "Temassız Sipariş",
      "Anında Güncelleme",
      "Mobil Uyumlu Tasarım",
      "Sipariş Yönetimi"
    ]
  }

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MenuMGO",
    "url": "https://menumgo.digital",
    "logo": "https://menumgo.digital/meta/og-image.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "info@menumgo.digital",
      "contactType": "customer support",
      "availableLanguage": ["Turkish", "English"]
    },
    "sameAs": [
      "https://twitter.com/menumgo"
    ]
  }

  return (
    <html lang="tr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
        />
      </head>
      <body className={`font-sans antialiased ${playfairDisplay.variable}`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
