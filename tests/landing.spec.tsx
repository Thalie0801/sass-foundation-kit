import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import { MemoryRouter } from 'react-router-dom';

import NewLandingPage, { calc } from '@/components/landing/NewLandingPage';

describe('NewLandingPage', () => {
  it('affiche le hero et oriente les CTA vers les offres', () => {
    render(
      <MemoryRouter>
        <NewLandingPage />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/plan éditorial mensuel & calendrier de publication/i),
    ).toBeInTheDocument();

    const ctas = screen.getAllByRole('link', { name: /Démarrer l’essai 7 jours/i });
    expect(ctas).not.toHaveLength(0);
    ctas.forEach((cta) => {
      expect(cta).toHaveAttribute('href', '#offres');
    });

    expect(screen.getByRole('link', { name: /Explorer la plateforme/i })).toHaveAttribute('href', '/app/client');
    expect(screen.getByRole('link', { name: /Se connecter/i })).toHaveAttribute('href', '/login');
    expect(screen.getByRole('link', { name: /S’inscrire/i })).toHaveAttribute('href', '/register');
  });

  it('bascule vers la tarification annuelle', () => {
    render(
      <MemoryRouter>
        <NewLandingPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Annuel' }));

    expect(screen.getByTestId('price-pro')).toHaveTextContent('–10% vs mensuel');
  });
});

describe('calc helpers', () => {
  it('calcule les tarifs avec les remises attendues', () => {
    expect(calc.discountedFirstMonth(179)).toBe(134.25);
    expect(calc.discountedFirstMonth(399)).toBe(299.25);
    expect(calc.annual(79)).toBeCloseTo(853.2, 2);
  });
});
