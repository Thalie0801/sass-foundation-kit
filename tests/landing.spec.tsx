import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const renderLanding = async () => {
  const module = await import('@/components/landing/LandingPage');
  const LandingPage = module.default;
  return render(
    <MemoryRouter>
      <LandingPage />
    </MemoryRouter>
  );
};

describe('LandingPage', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('affiche le slogan et le CTA Voir les tarifs', async () => {
    const scrollIntoView = vi.fn();
    vi.stubEnv('VITE_LINK_PRO', '');
    await renderLanding();
    expect(screen.getByText(/la plateforme éditoriale qui publie pour vous/i)).toBeInTheDocument();
    const cta = screen.getAllByRole('button', { name: /Voir les tarifs/i })[0];
    const querySpy = vi
      .spyOn(document, 'querySelector')
      .mockReturnValue({ scrollIntoView } as unknown as Element);
    fireEvent.click(cta);
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    querySpy.mockRestore();
  });

  it('active les boutons de paiement lorsque les liens sont configurés', async () => {
    vi.stubEnv('VITE_LINK_ESSENTIAL', 'https://example.com/essential');
    vi.stubEnv('VITE_LINK_STARTER', 'https://example.com/starter');
    vi.stubEnv('VITE_LINK_PRO', 'https://example.com/pro');
    vi.stubEnv('VITE_LINK_FYNK', 'https://example.com/fynk');
    vi.stubEnv('VITE_LINK_FYNK_PRO', 'https://example.com/fynk-pro');

    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    await renderLanding();

    const proButton = screen.getByRole('button', { name: /Choisir Pro/i });
    expect(proButton).not.toBeDisabled();
    fireEvent.click(proButton);
    expect(openSpy).toHaveBeenCalledWith('https://example.com/pro', '_blank', 'noopener,noreferrer');
  });

  it('désactive les boutons lorsque le lien contient uniquement des espaces', async () => {
    vi.stubEnv('VITE_LINK_PRO', '   ');

    await renderLanding();

    const proButton = screen.getByRole('button', { name: /Choisir Pro/i });
    expect(proButton).toBeDisabled();
  });
});
