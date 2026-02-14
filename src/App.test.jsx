import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
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
    expect(screen.getByText(/amber noir/i)).toBeInTheDocument();
    expect(screen.queryByText(/manhattan fig/i)).not.toBeInTheDocument();
  });

  it('renders QR candle pricing page on /prices', () => {
    renderWithRoute('/prices');
    expect(screen.getByRole('heading', { name: /in-store candle prices/i })).toBeInTheDocument();
    expect(screen.getByText(/midnight fig/i)).toBeInTheDocument();
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

  it('shows valentine strip and badges when mode is forced on', () => {
    renderWithRoute('/?valentine=1');
    expect(screen.getByLabelText(/valentine's day promotion/i)).toBeInTheDocument();
    expect(screen.getByText(/ends tonight at 11:59 pm/i)).toBeInTheDocument();
    expect(screen.getAllByText(/valentine edition/i).length).toBeGreaterThan(0);
  });
});
