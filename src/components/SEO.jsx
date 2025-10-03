import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title = "Murlidhar Studio - Professional Photography & Videography",
  description = "Professional photography and videography services including wedding photography, pre-wedding shoots, engagement photography, child photography, maternity shoots, and cinematic videos.",
  keywords = "photography, videography, wedding photography, pre-wedding, engagement, child photography, maternity shoot, cinematic videos, professional photographer, Murlidhar Studio",
  image = "/logo.png",
  url = "",
  type = "website",
  siteName = "Murlidhar Studio",
  robots = "index, follow"
}) => {
  const fullUrl = url ? `https://murlidharstudio.com${url}` : "https://murlidharstudio.com";
  const fullImageUrl = image.startsWith('http') ? image : `https://murlidharstudio.com${image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Murlidhar Studio" />
      <meta name="robots" content={robots} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      
      {/* Additional SEO Tags */}
      <meta name="theme-color" content="#000000" />
      <meta name="msapplication-TileColor" content="#000000" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "PhotographyBusiness",
          "name": "Murlidhar Studio",
          "description": "Professional photography and videography services",
          "url": "https://murlidharstudio.com",
          "logo": "https://murlidharstudio.com/logo.png",
          "image": fullImageUrl,
          "telephone": "+91-9979912805",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "IN",
            "addressLocality": "Anjar",
            "addressRegion": "Gujarat",
            "postalCode": "370110",
            "streetAddress": "413/D, Laxmi Tokiz, Khatri bazar, Ganga Naka, Anjar, Kutch"
          },
          "sameAs": [
            "https://www.instagram.com/murlidhar_studio_official",
            "https://www.facebook.com/murlidhar.studio.official/"
          ],
          "serviceArea": {
            "@type": "GeoCircle",
            "geoMidpoint": {
              "@type": "GeoCoordinates",
              "latitude": "28.6139",
              "longitude": "77.2090"
            },
            "geoRadius": "100000"
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
