import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import ClientLayout from "./client-layout"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL('https://menumgo.digital'),
  title: {
    default: 'MenuMGO - Dijital Menü Çözümü',
    template: '%s | MenuMGO'
  },
  description: 'MenuMGO ile dijital menünüzü oluşturun, QR kodla müşterilerinize ulaşın. Kolay yönetim, hızlı sipariş alma ve modern görünüm.',
  keywords: ['dijital menü', 'qr menü', 'restoran menüsü', 'cafe menüsü', 'online menü', 'menumgo'],
  authors: [{ name: 'MenuMGO', url: 'https://menumgo.digital' }],
  creator: 'MenuMGO',
  publisher: 'MenuMGO',
  generator: 'MenuMGO Platform',
  applicationName: 'MenuMGO',
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://menumgo.digital',
    title: 'MenuMGO - Dijital Menü Çözümü',
    description: 'MenuMGO ile dijital menünüzü oluşturun, QR kodla müşterilerinize ulaşın.',
    siteName: 'MenuMGO',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MenuMGO - Dijital Menü Çözümü',
    description: 'MenuMGO ile dijital menünüzü oluşturun, QR kodla müşterilerinize ulaşın.',
    creator: '@menumgo',
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
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        url: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        url: '/favicon-16x16.png',
      },
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#8B5A3C'
      },
    ],
  },
  manifest: '/site.webmanifest',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: 'google-site-verification-code', // Google Search Console doğrulama kodu
  },
  alternates: {
    canonical: 'https://menumgo.digital',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
