import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';

import { MemoryRouter } from 'react-router-dom';

import NewLandingPage, { calc } from '@/components/landing/NewLandingPage';

describe('NewLandingPage', () => {
  it('affiche le hero, la navigation courte et les CTA auth', () => {
    render(
      <MemoryRouter>
        <NewLandingPage />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/plan éditorial complet & contenus prêts à publier/i),
    ).toBeInTheDocument();

    const nav = screen.getByRole('navigation');
    const navLinks = within(nav).getAllByRole('link');
    expect(navLinks.map((link) => link.textContent?.trim())).toEqual(['Æditus', 'Gains', 'Tarifs']);

    expect(screen.getByRole('link', { name: /Démarrer l’essai 7 jours/i })).toHaveAttribute('href', '/auth/signup');
    expect(screen.getByRole('link', { name: /Auth sécurisée/i })).toHaveAttribute('href', '/auth/signin');
    expect(screen.getByRole('link', { name: /Se connecter à la plateforme/i })).toHaveAttribute('href', '/auth/signin');
    expect(screen.getByRole('link', { name: /S’inscrire/i })).toHaveAttribute('href', '/auth/signup');
    expect(screen.getByText('+48 %')).toBeInTheDocument();
  });

  it('bascule vers la tarification annuelle', () => {
    render(
      <MemoryRouter>
        <NewLandingPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Basculer la tarification/i }));

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
