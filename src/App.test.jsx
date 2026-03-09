import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';

const renderWithRoute = (route) =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>,
  );

describe('App routing UI', () => {
  it('renders the home hero on /', () => {
    renderWithRoute('/');
    expect(screen.getByRole('heading', { name: /elegance in every breath/i })).toBeInTheDocument();
  });

  it('renders filtered candles collection on /candles', () => {
    renderWithRoute('/candles');
    expect(screen.getByRole('heading', { name: /luxury soy candles/i })).toBeInTheDocument();
  });

  it('renders QR candle pricing page on /prices', async () => {
    renderWithRoute('/prices');
    expect(await screen.findByRole('heading', { name: /in-store candle prices/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /open details for a roma in marble/i })).toBeInTheDocument();
  });

  it('redirects /scan to the pricing page', async () => {
    renderWithRoute('/scan');
    expect(await screen.findByRole('heading', { name: /in-store candle prices/i })).toBeInTheDocument();
  });

  it('closes the candle details modal on escape', async () => {
    renderWithRoute('/prices');

    fireEvent.click(await screen.findByRole('button', { name: /open details for a roma in marble/i }));
    expect(screen.getByRole('dialog', { name: /a roma in marble/i })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: /a roma in marble/i })).not.toBeInTheDocument();
  });

  it('closes the cart drawer on escape', async () => {
    renderWithRoute('/prices');

    fireEvent.click(await screen.findByRole('button', { name: /open details for a roma in marble/i }));
    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(screen.getByRole('dialog', { name: /your cart/i })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /your cart/i })).not.toBeInTheDocument();
    });
  });

  it('renders legal content on /privacy', () => {
    renderWithRoute('/privacy');
    expect(screen.getByRole('heading', { name: /privacy policy/i })).toBeInTheDocument();
    expect(screen.getByText(/we do not sell personal information/i)).toBeInTheDocument();
  });

  it('renders not found page on unknown route', () => {
    renderWithRoute('/missing-page');
    expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument();
  });

  it('closes mobile menu on route change', () => {
    renderWithRoute('/candles');

    expect(screen.getAllByRole('link', { name: /candle prices/i })).toHaveLength(1);

    const menuButton = document.querySelector('button[aria-label="Open navigation menu"]');
    expect(menuButton).not.toBeNull();
    fireEvent.click(menuButton);
    expect(screen.getAllByRole('link', { name: /candle prices/i })).toHaveLength(2);

    fireEvent.click(screen.getAllByRole('link', { name: /romazen/i })[0]);
    expect(screen.getAllByRole('link', { name: /candle prices/i })).toHaveLength(1);
  });
});
