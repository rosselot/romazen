import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { CartProvider, useCart } from './context/CartContext';

const renderWithRoute = (route) =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>,
  );

beforeEach(() => localStorage.clear());
afterEach(() => vi.unstubAllGlobals());

const CartHarness = () => {
  const { addItem, items } = useCart();
  return (
    <>
      <button onClick={() => addItem({ id: 'halo', name: 'The Halo', price: '$38.00' })}>Add candle</button>
      <span>{items.length}</span>
    </>
  );
};

describe('App routing UI', () => {
  it('adds a single candle to the cart', () => {
    render(<CartProvider><CartHarness /></CartProvider>);
    fireEvent.click(screen.getByRole('button', { name: /add candle/i }));
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('renders the home hero on /', () => {
    renderWithRoute('/');
    expect(screen.getByRole('heading', { name: /sculptural candles. a new home in new york/i })).toBeInTheDocument();
  });

  it('renders filtered candles collection on /candles', async () => {
    renderWithRoute('/candles');
    expect(await screen.findByRole('heading', { name: /luxury soy candles/i })).toBeInTheDocument();
  });

  it('renders QR candle pricing page on /prices', async () => {
    renderWithRoute('/prices');
    expect(await screen.findByRole('heading', { name: /one floral ritual. six sculptural forms/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /open details for the ripple/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /open details for the atrium/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /open details for the halo/i })).toBeInTheDocument();
    expect(screen.getAllByText('3½″ H × 3½″ W')).toHaveLength(2);
    expect(screen.getByText('6″ H × 3⅜″ W')).toBeInTheDocument();
    expect(screen.getAllByText(/gardenia · jasmine/i).length).toBeGreaterThanOrEqual(6);
  });

  it('redirects /scan to the pricing page', async () => {
    renderWithRoute('/scan');
    expect(await screen.findByRole('heading', { name: /one floral ritual. six sculptural forms/i })).toBeInTheDocument();
  });

  it('closes the candle details modal on escape', async () => {
    renderWithRoute('/prices');

    fireEvent.click(await screen.findByRole('button', { name: /open details for the arch/i }));
    expect(screen.getByRole('dialog', { name: /the arch/i })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: /the arch/i })).not.toBeInTheDocument();
  });

  it('closes the cart drawer on escape', async () => {
    localStorage.setItem('romazen_cart', JSON.stringify({
      version: 2,
      items: [{
        id: 'roman-marble-8oz',
        name: 'The Arch',
        price: '$52.00',
        quantity: 1,
        image: '/assets/images/NoHexagonalOnBooks.jpeg',
        imageWidth: 1024,
      }],
    }));
    renderWithRoute('/prices');

    fireEvent.click(await screen.findByRole('button', { name: /open shopping cart/i }));
    expect(await screen.findByRole('dialog', { name: /your cart/i })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /your cart/i })).not.toBeInTheDocument();
    });
  });

  it('renders legal content on /privacy', async () => {
    renderWithRoute('/privacy');
    expect(await screen.findByRole('heading', { name: /privacy policy/i })).toBeInTheDocument();
    expect(await screen.findByText(/we do not sell personal information/i)).toBeInTheDocument();
  });

  it('renders not found page on unknown route', async () => {
    renderWithRoute('/missing-page');
    expect(await screen.findByRole('heading', { name: /page not found/i })).toBeInTheDocument();
  });

  it('never confirms an unverified checkout return', async () => {
    renderWithRoute('/checkout/success');
    expect(await screen.findByRole('heading', { name: /confirmation unavailable/i })).toBeInTheDocument();
    expect(screen.getByText(/no paid order has been confirmed/i)).toBeInTheDocument();
  });

  it('clears the cart once after a verified payment', async () => {
    const result = { verified: true, reference: 'ABC123' };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => result }));
    localStorage.setItem('romazen_cart', JSON.stringify({
      version: 2,
      items: [{ id: 'candle', name: 'Candle', price: '$52.00', quantity: 1 }],
    }));

    const view = renderWithRoute('/checkout/success?session_id=cs_test_abc123');
    expect(await screen.findByRole('heading', { name: /order is confirmed/i })).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('romazen_cart')).items).toHaveLength(0);

    view.unmount();
    localStorage.setItem('romazen_cart', JSON.stringify({
      version: 2,
      items: [{ id: 'new-candle', name: 'New Candle', price: '$50.00', quantity: 1 }],
    }));
    renderWithRoute('/checkout/success?session_id=cs_test_abc123');
    expect(await screen.findByRole('heading', { name: /order is confirmed/i })).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('romazen_cart')).items).toHaveLength(1);
  });

  it('explains cancellation without clearing the cart', async () => {
    localStorage.setItem('romazen_cart', JSON.stringify({
      version: 2,
      items: [{ id: 'candle', name: 'Candle', price: '$52.00', quantity: 1 }],
    }));
    renderWithRoute('/checkout/cancelled');

    expect(await screen.findByRole('heading', { name: /checkout cancelled/i })).toBeInTheDocument();
    expect(screen.getByText(/no payment was completed/i)).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('romazen_cart')).items).toHaveLength(1);
  });

  it('closes mobile menu on route change', () => {
    renderWithRoute('/candles');

    expect(screen.getAllByRole('link', { name: /shop the forms/i })).toHaveLength(1);

    const menuButton = document.querySelector('button[aria-label="Open navigation menu"]');
    expect(menuButton).not.toBeNull();
    fireEvent.click(menuButton);
    expect(screen.getAllByRole('link', { name: /shop the forms/i })).toHaveLength(2);

    fireEvent.click(screen.getAllByRole('link', { name: /romazen/i })[0]);
    expect(screen.getAllByRole('link', { name: /shop the forms/i })).toHaveLength(1);
  });
});
