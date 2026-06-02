import type { Metadata } from "next";
import "./globals.css";
// CookieBanner reemplazado por Google Funding Choices CMP (certificada por Google)
import { ThemeProvider } from "@/components/ThemeProvider";
import Script from "next/script";
import DemoBanner from "@/components/DemoBanner";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://tudominio.com"),
  title: "Mi Blog | Artículos y Tecnología",
  description:
    "Una plantilla profesional para publicar artículos sobre tecnología, programación y sistemas.",
  keywords: [
    "blog",
    "tecnología",
    "programación",
    "desarrollo",
    "Next.js",
    "TypeScript",
  ],
  authors: [{ name: "[Tu Nombre]" }],
  creator: "[Tu Nombre]",
  publisher: "[Tu Nombre]",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "https://tudominio.com",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://tudominio.com",
    siteName: "Mi Blog",
    title: "Mi Blog | Artículos y Tecnología",
    description:
      "Una plantilla profesional para publicar artículos sobre tecnología, programación y sistemas.",
    images: [
      {
        url: "https://tudominio.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mi Blog — Artículos y Tecnología",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mi Blog | Artículos y Tecnología",
    description:
      "Una plantilla profesional para publicar artículos sobre tecnología, programación y sistemas.",
    images: ["https://tudominio.com/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  // No cargar AdSense si es el ID de ejemplo/placeholder
  const validAdsenseId = adsenseClientId && !adsenseClientId.includes('XXXXXXXX') ? adsenseClientId : null;

  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        {/* Google Consent Mode v2 — Inicialización por defecto antes de AdSense */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;

              var defaultConsent = 'denied';
              try {
                if (localStorage.getItem('cookie-consent') === 'accepted') {
                  defaultConsent = 'granted';
                }
              } catch (e) {}

              gtag('consent', 'default', {
                'ad_storage': defaultConsent,
                'ad_user_data': defaultConsent,
                'ad_personalization': defaultConsent,
                'analytics_storage': defaultConsent
              });
            `,
          }}
        />

        {validAdsenseId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${validAdsenseId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false}>
          {process.env.NEXT_PUBLIC_IS_DEMO === 'true' && <DemoBanner />}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
