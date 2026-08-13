import React from 'react';

const getOptimizedBase = (src) => {
  if (!src?.startsWith('/assets/images/') || src.includes('/optimized/')) return null;
  const filename = src.split('/').pop().replace(/\.[^.]+$/, '');
  return `/assets/images/optimized/${filename}`;
};

const ResponsiveImage = ({ src, naturalWidth, sizes, alt, ...props }) => {
  const base = getOptimizedBase(src);
  if (!base || !naturalWidth) return <img src={src} alt={alt} sizes={sizes} {...props} />;

  const avifSet = `${base}-480.avif 480w, ${base}.avif ${naturalWidth}w`;
  const webpSet = `${base}-480.webp 480w, ${base}.webp ${naturalWidth}w`;

  return (
    <picture>
      <source type="image/avif" srcSet={avifSet} sizes={sizes} />
      <source type="image/webp" srcSet={webpSet} sizes={sizes} />
      <img src={`${base}.webp`} alt={alt} sizes={sizes} {...props} />
    </picture>
  );
};

export default ResponsiveImage;
