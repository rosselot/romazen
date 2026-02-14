import { render } from '@testing-library/react';
import { usePageMeta } from './usePageMeta';

const MetaHarness = ({ title, description, noIndex = false }) => {
  usePageMeta({ title, description, noIndex });
  return null;
};

const getMeta = (attr, key) => document.head.querySelector(`meta[${attr}="${key}"]`)?.getAttribute('content');
const getCanonical = () => document.head.querySelector('link[rel="canonical"]')?.getAttribute('href');

describe('usePageMeta', () => {
  it('sets canonical, robots, and social meta tags', () => {
    window.history.pushState({}, '', '/privacy');

    render(
      <MetaHarness
        title="Privacy Policy | Romazen"
        description="Read the Romazen privacy policy and how personal information is handled."
      />,
    );

    const origin = window.location.origin;

    expect(document.title).toBe('Privacy Policy | Romazen');
    expect(getCanonical()).toBe(`${origin}/privacy`);
    expect(getMeta('name', 'robots')).toBe('index,follow');
    expect(getMeta('property', 'og:title')).toBe('Privacy Policy | Romazen');
    expect(getMeta('property', 'og:url')).toBe(`${origin}/privacy`);
    expect(getMeta('name', 'twitter:title')).toBe('Privacy Policy | Romazen');
    expect(getMeta('name', 'description')).toBe(
      'Read the Romazen privacy policy and how personal information is handled.',
    );
  });

  it('applies noindex,nofollow when noIndex is enabled', () => {
    window.history.pushState({}, '', '/missing-page');

    render(
      <MetaHarness
        title="Page Not Found | Romazen"
        description="The page you are looking for could not be found."
        noIndex
      />,
    );

    const origin = window.location.origin;

    expect(getMeta('name', 'robots')).toBe('noindex,nofollow');
    expect(getCanonical()).toBe(`${origin}/missing-page`);
  });
});
