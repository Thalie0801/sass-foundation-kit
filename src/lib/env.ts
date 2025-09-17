export const getBetaLink = (): string | undefined => {
  const rawValue = import.meta.env.VITE_STRIPE_BETA_LINK;

  if (typeof rawValue !== "string") {
    return undefined;
  }

  const trimmedValue = rawValue.trim();

  return trimmedValue.length > 0 ? trimmedValue : undefined;
};
