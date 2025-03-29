
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
}

const SEOHead = ({
  title = 'Nexify - AI-Powered Job Platform | Find Your Dream Career',
  description = 'Nexify uses AI-powered matching, blockchain verification, and AR interview technology to connect job seekers with their perfect career opportunities.',
  keywords = 'jobs, career, job search, AI matching, hiring, employment, HR professionals, job portal',
  canonical = '',
  ogImage = '/og-image.png',
  ogType = 'website'
}: SEOHeadProps) => {
  // Get URL safely with a check for window object
  const getUrl = () => {
    if (typeof window === 'undefined') {
      return '';
    }
    const siteUrl = window.location.origin;
    return canonical ? `${siteUrl}${canonical}` : window.location.href;
  };
  
  const url = getUrl();
  const imageUrl = typeof window !== 'undefined' ? `${window.location.origin}${ogImage}` : ogImage;
  
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {url && <link rel="canonical" href={url} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      {url && <meta property="twitter:url" content={url} />}
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={imageUrl} />
    </Helmet>
  );
};

export default SEOHead;
