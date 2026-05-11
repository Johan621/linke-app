import "./globals.css";
import JsonLd from "@/components/JsonLd";

export const metadata = {
  metadataBase: new URL('https://linke-app.vercel.app'),
  title: {
    default: 'Linke | Fast Offline Bookmark Manager',
    template: '%s | Linke',
  },
  description: 'An offline-first, lightning-fast bookmark manager. Save, organize, and search your links seamlessly without relying on the cloud.',
  keywords: ['offline bookmark manager', 'save links app', 'PWA bookmark tool', 'developer link organizer'],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Linke",
  },
  openGraph: {
    title: 'Linke | Fast Offline Bookmark Manager',
    description: 'Save and organize your links instantly with offline-first capabilities.',
    url: 'https://linke-app.vercel.app',
    siteName: 'Linke',
    images: [{ url: '/linke_social_logo.jpg', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Linke | Offline Bookmark Manager',
    description: 'Save and organize your links instantly.',
    images: ['/linke_social_logo.jpg'],
  },
  verification: {
    google: "hcbBZVvpQo1tmPEu3xkr1h6L9qRMltCni4AtKzvF3P4",
  },
  alternates: {
    canonical: '/',
  },
};

export const viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <JsonLd />
      </head>
      <body>{children}</body>
    </html>
  );
}
