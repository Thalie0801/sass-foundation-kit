export const getBetaLink = (): string | undefined => {
  const rawLink = import.meta.env.VITE_STRIPE_BETA_LINK;

  if (typeof rawLink !== "string") {
    return undefined;
  }

  const trimmedLink = rawLink.trim();

  return trimmedLink.length > 0 ? trimmedLink : undefined;
};
