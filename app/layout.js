import "./globals.css";

export const metadata = {
  title: "Linke — Save Links Effortlessly",
  description:
    "Linke is an offline-first link management PWA. Paste a URL, auto-fetch metadata, organize with folders and tags, and search across all your saved links — even offline.",
  keywords: ["link manager", "bookmark manager", "PWA", "offline", "URL organizer"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Linke",
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
      </head>
      <body>{children}</body>
    </html>
  );
}
