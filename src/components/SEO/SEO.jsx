import React from "react";
import { Helmet } from "react-helmet-async";
import logoImg from "../../assets/logo.png";

const SEO = ({
  title = "GearUp - Professional Business Consulting Services",
  description = "GearUp offers comprehensive business consulting services to help your company grow and succeed. Expert advisory services, strategic planning, and innovative solutions for modern businesses.",
  keywords = "business consulting, strategic planning, business advisory, corporate consulting, business solutions, consulting services, business growth, GearUp",
  url = "https://gearup.com",
  image = logoImg,
  type = "website",
}) => {
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="GearUp" />

      {/* Favicon */}
      <link rel="icon" type="image/png" href={logoImg} />
      <link rel="shortcut icon" type="image/png" href={logoImg} />
      <link rel="apple-touch-icon" href={logoImg} />

      {/* Open Graph Meta Tags for Social Media */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="GearUp" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@gearup" />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#284b63" />
      <meta name="msapplication-TileColor" content="#284b63" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Language */}
      <meta property="og:locale" content="en_US" />

      {/* Robots */}
      <meta name="robots" content="index, follow" />

      {/* Additional structured data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "GearUp",
          url: url,
          logo: image,
          description: description,
          contactPoint: {
            "@type": "ContactPoint",
            email: "info@gearup.com",
            contactType: "Customer Service",
          },
          sameAs: [
            "https://linkedin.com/company/gearup",
            "https://twitter.com/gearup",
          ],
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
