import { Helmet } from "react-helmet-async";

type Props = {
  title: string;
  description?: string;
  pathname?: string;
  image?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

const SITE = "Northern Transformation Initiative";
const BASE_URL = "https://ntiafrica.org";
const DEFAULT_IMAGE = `${BASE_URL}/og-default.png`;

export default function Seo({
  title,
  description,
  pathname,
  image,
  jsonLd,
}: Props) {
  const fullTitle = `${title} · ${SITE}`;
  const url = pathname ? `${BASE_URL}${pathname}` : BASE_URL;
  const ogImage = image || DEFAULT_IMAGE;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <link rel="canonical" href={url} />

      {description && <meta name="description" content={description} />}

      <meta property="og:title" content={fullTitle} />
      {description && (
        <meta property="og:description" content={description} />
      )}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={SITE} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && (
        <meta name="twitter:description" content={description} />
      )}
      <meta name="twitter:image" content={ogImage} />

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}

/** Organization-level JSON-LD; mount once at the app root. */
export function GlobalNgoJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: SITE,
    alternateName: "NTI",
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description:
      "Northern Transformation Initiative protects vulnerable children and expands their opportunities through safe care, education, protection, and development programs in Kenya.",
    address: [
      {
        "@type": "PostalAddress",
        streetAddress: "P.O. Box 14271-00100",
        addressLocality: "Nairobi",
        addressCountry: "KE",
      },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "info@northerntransformationinitiative.org",
      },
    ],
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(data)}
      </script>
    </Helmet>
  );
}
