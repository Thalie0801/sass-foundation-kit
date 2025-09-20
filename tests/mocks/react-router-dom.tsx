/* eslint-disable react-refresh/only-export-components */
import type { AnchorHTMLAttributes, ReactNode } from 'react';

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

export const Link = ({ to, children, ...props }: LinkProps) => (
  <a href={typeof to === 'string' ? to : '#'} {...props}>
    {children}
  </a>
);

export const NavLink = Link;

export const MemoryRouter = ({ children }: { children: ReactNode }) => <div data-testid="router-mock">{children}</div>;
export const BrowserRouter = MemoryRouter;
export const Routes = ({ children }: { children?: ReactNode }) => <>{children}</>;
export const Route = ({ element }: { element?: ReactNode }) => <>{element}</>;
export const Outlet = ({ children }: { children?: ReactNode }) => <>{children}</>;
export const Navigate = ({ to }: { to: string }) => <a href={to} />;

export const useLocation = () => ({ pathname: '/', search: '', hash: '', state: undefined, key: 'mock' });
export const useNavigate = () => () => {};
