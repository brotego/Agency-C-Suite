import "./globals.css";
import ClientLayout from "@/client-layout";
import TopBar from "@/components/TopBar/TopBar";
import Script from "next/script";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://agencycsuite.com"),
  title: {
    default: "Agency C-Suite | Fractional Executives for Creative Agencies",
    template: "%s | Agency C-Suite",
  },
  description: "Fractional executives for start-up and independent creative agencies. Expert guidance in finance, legal, operations, and growth from 25+ years of agency leadership experience.",
  keywords: [
    "fractional CEO",
    "fractional executives",
    "creative agency consulting",
    "agency consulting",
    "fractional CFO",
    "agency growth",
    "creative agency startup",
    "agency operations",
    "independent agency",
    "agency leadership"
  ],
  authors: [{ name: "Jordan Warren" }],
  creator: "Jordan Warren",
  publisher: "Agency C-Suite",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/logo.JPEG",
    apple: "/logo.JPEG",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Agency C-Suite",
    title: "Agency C-Suite | Fractional Executives for Creative Agencies",
    description: "Fractional executives for start-up and independent creative agencies. Expert guidance from 25+ years of agency leadership experience.",
    images: [
      {
        url: "/logo.JPEG",
        width: 1200,
        height: 630,
        alt: "Agency C-Suite - Fractional Executives for Creative Agencies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Agency C-Suite | Fractional Executives for Creative Agencies",
    description: "Fractional executives for start-up and independent creative agencies. Expert guidance from 25+ years of agency leadership experience.",
    images: ["/logo.JPEG"],
    creator: "@agencycsuite",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // yahoo: "your-yahoo-verification-code",
  },
};

export default function RootLayout({ children }) {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://agencycsuite.com";

  // Structured data for Organization
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Agency C-Suite",
    url: baseUrl,
    logo: `${baseUrl}/logo.JPEG`,
    description: "Fractional executives for start-up and independent creative agencies. Expert guidance from 25+ years of agency leadership experience.",
    founder: {
      "@type": "Person",
      name: "Jordan Warren",
      url: "https://www.linkedin.com/in/jordanwarren",
      jobTitle: "Founder, Principal Advisor and Fractional CEO",
    },
    sameAs: [
      "https://www.linkedin.com/in/jordanwarren",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Business Inquiry",
    },
  };

  // Structured data for Person (Jordan Warren)
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Jordan Warren",
    jobTitle: "Founder, Principal Advisor and Fractional CEO",
    worksFor: {
      "@type": "Organization",
      name: "Agency C-Suite",
    },
    url: "https://www.linkedin.com/in/jordanwarren",
    sameAs: ["https://www.linkedin.com/in/jordanwarren"],
    description: "Fractional CEO and agency advisor with over 25 years of experience founding and leading creative agencies including Eleven, Argonaut, and TBD.",
  };

  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        {gaMeasurementId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaMeasurementId}');
              `}
            </Script>
          </>
        )}
        <Script
          id="linkedin-platform"
          src="https://platform.linkedin.com/in.js"
          type="text/javascript"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: 'lang: en_US' }}
        />
        <ClientLayout>
          <TopBar />
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
