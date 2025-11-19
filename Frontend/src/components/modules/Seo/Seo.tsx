/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Helmet } from "react-helmet-async";

type SeoProps = {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  structuredData?: Record<string, any>;
};

const Seo: React.FC<SeoProps> = ({
  title = "হাওলাদার প্রকাশনী | অনলাইন বইয়ের বাজার",
  description = "হাওলাদার প্রকাশনী — বাংলাদেশের জনপ্রিয় অনলাইন বইয়ের বাজার। নতুন বই, উপন্যাস, ইসলামিক ও শিক্ষাসাহিত্য কিনুন অনলাইনে।",
  keywords = "Howladar Prokashoni, বই, অনলাইন বই, উপন্যাস, ইসলামিক বই, সাহিত্য",
  image = "/logo.jpg",
  url = "https://howladarporkasoni.com.bd",
  type = "website",
  structuredData,
}) => {
  return (
    <Helmet>
      <title>{title}</title>

      {/* Basic SEO */}
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />

      {/*  Open Graph (Facebook) */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />

      {/* 🔹 Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/*  JSON-LD Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default Seo;
