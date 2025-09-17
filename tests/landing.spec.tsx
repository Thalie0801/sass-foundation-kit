import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as env from '@/lib/env';
import Landing from '@/pages/Landing';

vi.mock('@/lib/env');

const renderPage = () => render(
  <MemoryRouter>
    <Landing />
  </MemoryRouter>
);

describe('Landing', () => {
  it('affiche le slogan et le CTA Starter', () => {
    (env.getBetaLink as any).mockReturnValue(undefined);
    renderPage();
    expect(
      screen.getByText(/la plateforme éditoriale qui publie pour vous/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Essai Starter 7 jours/i })
    ).toBeInTheDocument();
  });

  it('désactive le bouton Beta si le lien manque, puis l’ouvre s’il existe', () => {
    (env.getBetaLink as any).mockReturnValue(undefined);
    renderPage();
    const beta = screen.getByRole('button', { name: /Rejoindre la Beta/i });
    expect(beta).toBeDisabled();

    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    (env.getBetaLink as any).mockReturnValue('https://example.com/beta');

    // re-render avec lien défini
    renderPage();
    const beta2 = screen.getByRole('button', { name: /Rejoindre la Beta/i });
    expect(beta2).not.toBeDisabled();
    fireEvent.click(beta2);
    expect(openSpy).toHaveBeenCalled();
    openSpy.mockRestore();
  });
});
