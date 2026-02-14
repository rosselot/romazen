import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
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

  it('renders legal content on /privacy', () => {
    renderWithRoute('/privacy');
    expect(screen.getByRole('heading', { name: /privacy policy/i })).toBeInTheDocument();
    expect(screen.getByText(/we do not sell personal information/i)).toBeInTheDocument();
  });

  it('renders not found page on unknown route', () => {
    renderWithRoute('/missing-page');
    expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument();
  });
});
