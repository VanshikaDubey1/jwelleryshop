import type { Metadata, Viewport } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { FloatingWhatsApp } from '@/components/layout/floating-whatsapp';
import { BUSINESS_INFO } from '@/lib/config';

const APP_NAME = "Shreeji Photobooks";
const APP_DEFAULT_TITLE = "Shreeji Photobooks | Turning Your Memories Into Art";
const APP_TITLE_TEMPLATE = `%s | ${APP_NAME}`;
const APP_DESCRIPTION = "Your one-stop shop for professional photo printing, custom albums, and stunning acrylic prints in Kanpur. Turn your memories into art with Shreeji Photobooks.";


export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    url: "https://shreejiphotobooks.web.app",
    locale: "en_IN",
    images: [
      {
        url: 'https://shreejiphotobooks.web.app/og-image.jpg', // Replace with an actual OG image URL
        width: 1200,
        height: 630,
        alt: APP_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
     images: ['https://shreejiphotobooks.web.app/twitter-image.jpg'], // Replace with an actual Twitter image URL
  },
};

export const viewport: Viewport = {
  themeColor: "#CBA13A",
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: BUSINESS_INFO.name,
  description: APP_DESCRIPTION,
  address: {
    '@type': 'PostalAddress',
    streetAddress: '36/156 Shivala Road, Near Kesa Power House',
    addressLocality: 'Kanpur',
    addressRegion: 'UP',
    postalCode: '208001',
    addressCountry: 'IN',
  },
  telephone: BUSINESS_INFO.contact,
  email: BUSINESS_INFO.email,
  openingHours: 'Mo-Su 10:00-20:00',
  url: 'https://shreejiphotobooks.web.app', // Replace with the actual live URL
  image: 'https://shreejiphotobooks.web.app/logo.png', // Replace with an actual logo URL
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
       <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={cn("min-h-screen bg-background font-body antialiased")}>
        <div className="relative flex min-h-dvh flex-col bg-background">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingWhatsApp />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
