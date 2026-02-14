import { useEffect } from 'react';

const ensureMetaTag = (attr, key, value) => {
  let tag = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', value);
};

const ensureCanonicalTag = (href) => {
  let tag = document.head.querySelector('link[rel="canonical"]');
  if (!tag) {
    tag = document.createElement('link');
    tag.setAttribute('rel', 'canonical');
    document.head.appendChild(tag);
  }
  tag.setAttribute('href', href);
};

export const usePageMeta = ({ title, description, noIndex = false }) => {
  useEffect(() => {
    document.title = title;

    const origin = window.location.origin;
    const canonicalUrl = `${origin}${window.location.pathname}`;
    const imageUrl = `${origin}/assets/images/hero-bg.png`;

    ensureMetaTag('name', 'description', description);
    ensureMetaTag('name', 'robots', noIndex ? 'noindex,nofollow' : 'index,follow');
    ensureMetaTag('property', 'og:type', 'website');
    ensureMetaTag('property', 'og:site_name', 'Romazen');
    ensureMetaTag('property', 'og:title', title);
    ensureMetaTag('property', 'og:description', description);
    ensureMetaTag('property', 'og:url', canonicalUrl);
    ensureMetaTag('property', 'og:image', imageUrl);
    ensureMetaTag('name', 'twitter:card', 'summary_large_image');
    ensureMetaTag('name', 'twitter:title', title);
    ensureMetaTag('name', 'twitter:description', description);
    ensureMetaTag('name', 'twitter:image', imageUrl);
    ensureCanonicalTag(canonicalUrl);
  }, [title, description, noIndex]);
};
