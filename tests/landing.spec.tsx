import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LandingPage from "@/components/landing/LandingPage";

vi.mock("@/lib/env", () => ({
  env: {
    VITE_STARTER_SIGNUP_URL: "https://example.com/starter",
    VITE_STRIPE_BETA_LINK: "https://example.com/beta"
  }
}));

describe("LandingPage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the main marketing slogan", () => {
    render(<LandingPage />);

    expect(
      screen.getByRole("heading", {
        name: /La Plateforme\s+Ultime pour vos\s+Contenus/i
      })
    ).toBeInTheDocument();
  });

  it("directs users through the Starter and Beta CTAs", async () => {
    const user = userEvent.setup();
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);

    render(<LandingPage />);

    await user.click(screen.getByRole("button", { name: /Choisir Starter/i }));
    expect(openSpy).toHaveBeenCalledWith("https://example.com/starter", "_self");

    openSpy.mockClear();

    await user.click(screen.getByRole("button", { name: /Choisir Beta/i }));
    expect(openSpy).toHaveBeenCalledWith(
      "https://example.com/beta",
      "_blank",
      "noopener,noreferrer"
    );
  });
});
