import { useEffect } from 'react';

const PUBLIC_ORIGIN = 'https://www.romazen.com';

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
  if (!href) {
    tag?.remove();
    return;
  }
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

    const canonicalUrl = `${PUBLIC_ORIGIN}${window.location.pathname}`;
    const imageUrl = `${PUBLIC_ORIGIN}/og-six-forms.jpg`;

    ensureMetaTag('name', 'description', description);
    ensureMetaTag('name', 'robots', noIndex ? 'noindex,nofollow' : 'index,follow');
    ensureMetaTag('property', 'og:type', 'website');
    ensureMetaTag('property', 'og:site_name', 'Romazen');
    ensureMetaTag('property', 'og:title', title);
    ensureMetaTag('property', 'og:description', description);
    ensureMetaTag('property', 'og:url', canonicalUrl);
    ensureMetaTag('property', 'og:image', imageUrl);
    ensureMetaTag('property', 'og:image:width', '1200');
    ensureMetaTag('property', 'og:image:height', '633');
    ensureMetaTag('name', 'twitter:card', 'summary_large_image');
    ensureMetaTag('name', 'twitter:title', title);
    ensureMetaTag('name', 'twitter:description', description);
    ensureMetaTag('name', 'twitter:image', imageUrl);
    ensureCanonicalTag(noIndex ? null : canonicalUrl);
  }, [title, description, noIndex]);
};
