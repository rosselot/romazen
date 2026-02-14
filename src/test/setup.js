import '@testing-library/jest-dom/vitest';

class IntersectionObserverMock {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (!globalThis.IntersectionObserver) {
  globalThis.IntersectionObserver = IntersectionObserverMock;
}

Object.defineProperty(window, 'scrollTo', {
  value: () => {},
  writable: true,
});
