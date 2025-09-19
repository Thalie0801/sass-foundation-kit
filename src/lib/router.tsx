/* eslint-disable react-refresh/only-export-components */
import {
  Children,
  createContext,
  isValidElement,
  type AnchorHTMLAttributes,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

const normalizePath = (path: string) => {
  if (!path) return "/";
  let value = path.startsWith("/") ? path : `/${path}`;
  if (value.length > 1 && value.endsWith("/")) {
    value = value.slice(0, -1);
  }
  return value || "/";
};

const resolvePath = (to: string, basePath: string) => {
  if (!to) return normalizePath(basePath);
  if (to.startsWith("/")) return normalizePath(to);
  const segments = [
    ...normalizePath(basePath)
      .split("/")
      .filter(Boolean),
    ...to.split("/").filter(Boolean)
  ];
  return segments.length ? `/${segments.join("/")}` : "/";
};

type LocationShape = { pathname: string };

type RouterContextValue = {
  location: LocationShape;
  navigate: (to: string, options?: { replace?: boolean }) => void;
};

const RouterContext = createContext<RouterContextValue | null>(null);
const RouteContext = createContext<{ basePath: string }>({ basePath: "/" });
const OutletContext = createContext<ReactNode>(null);

const useRouter = () => {
  const ctx = useContext(RouterContext);
  if (!ctx) {
    throw new Error("Router context introuvable. Placez un Router en amont.");
  }
  return ctx;
};

const useRouteContext = () => useContext(RouteContext);

export const useLocation = () => useRouter().location;

export const useNavigate = () => useRouter().navigate;

export const Outlet = () => {
  const outlet = useContext(OutletContext);
  return <>{outlet}</>;
};

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

export const Link = ({ to, onClick, target, rel, ...rest }: LinkProps) => {
  const router = useRouter();
  const { basePath } = useRouteContext();
  const href = resolvePath(to, basePath);

  const handleClick: AnchorHTMLAttributes<HTMLAnchorElement>["onClick"] = (event) => {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      target === "_blank"
    ) {
      return;
    }
    event.preventDefault();
    router.navigate(href);
  };

  return <a {...rest} href={href} onClick={handleClick} target={target} rel={rel} />;
};

type NavLinkProps = LinkProps & {
  end?: boolean;
  className?: string | ((args: { isActive: boolean }) => string);
  style?: ComponentProps<"a">["style"] | ((args: { isActive: boolean }) => ComponentProps<"a">["style"]);
};

export const NavLink = ({ end, className, style, ...rest }: NavLinkProps) => {
  const router = useRouter();
  const { basePath } = useRouteContext();
  const href = resolvePath(rest.to, basePath);
  const current = normalizePath(router.location.pathname);
  const candidate = normalizePath(href);
  const isActive = end ? current === candidate : current === candidate || current.startsWith(`${candidate}/`);
  const computedClass = typeof className === "function" ? className({ isActive }) : className;
  const computedStyle = typeof style === "function" ? style({ isActive }) : style;

  return <Link {...rest} to={rest.to} className={computedClass} style={computedStyle} />;
};

type NavigateProps = { to: string; replace?: boolean };

export const Navigate = ({ to, replace }: NavigateProps) => {
  const router = useRouter();
  const { basePath } = useRouteContext();
  const destination = useMemo(() => resolvePath(to, basePath), [to, basePath]);

  useEffect(() => {
    router.navigate(destination, { replace });
  }, [destination, replace, router]);

  return null;
};

type RouteProps = {
  path?: string;
  element?: ReactNode;
  index?: boolean;
  children?: ReactNode;
};

const Route = (_props: RouteProps) => null;

type RoutesProps = { children?: ReactNode };

type RouteElement = ReactElement<RouteProps>;

const matchRoute = (
  element: RouteElement,
  basePath: string,
  pathname: string,
  isFallback = false
): ReactNode | null => {
  const { path, index, element: component, children } = element.props;
  const normalizedBase = normalizePath(basePath);

  if (index) {
    if (normalizePath(pathname) !== normalizedBase) {
      return null;
    }
  } else if (!isFallback) {
    if (!path) {
      return null;
    }
    const target = resolvePath(path, basePath);
    const normalizedTarget = normalizePath(target);
    const normalizedLocation = normalizePath(pathname);
    const hasChildren = Children.count(children) > 0;
    const exactMatch = normalizedLocation === normalizedTarget;
    const partialMatch = hasChildren && normalizedLocation.startsWith(`${normalizedTarget}/`);
    if (!exactMatch && !partialMatch) {
      return null;
    }
  }

  const routeBase = index ? normalizedBase : path && path !== "*" ? resolvePath(path, basePath) : normalizedBase;
  const outlet = children ? (
    <RouteContext.Provider value={{ basePath: routeBase }}>
      <Routes>{children}</Routes>
    </RouteContext.Provider>
  ) : null;

  return (
    <RouteContext.Provider value={{ basePath: routeBase }}>
      <OutletContext.Provider value={outlet}>{component ?? outlet}</OutletContext.Provider>
    </RouteContext.Provider>
  );
};

export const Routes = ({ children }: RoutesProps) => {
  const { location } = useRouter();
  const { basePath } = useRouteContext();
  const entries = Children.toArray(children).filter(isValidElement) as RouteElement[];

  let fallback: RouteElement | null = null;

  for (const entry of entries) {
    if (entry.props.path === "*") {
      fallback = entry;
      continue;
    }
    const match = matchRoute(entry, basePath, location.pathname);
    if (match) {
      return <>{match}</>;
    }
  }

  if (fallback) {
    return <>{matchRoute(fallback, basePath, location.pathname, true)}</>;
  }

  return null;
};

type RouterProps = { children?: ReactNode };

type HistoryRouterProps = RouterProps & {
  getCurrentLocation: () => LocationShape;
  pushLocation: (to: string, replace?: boolean) => string;
  listen: (listener: () => void) => () => void;
};

const HistoryRouter = ({ children, getCurrentLocation, pushLocation, listen }: HistoryRouterProps) => {
  const [location, setLocation] = useState<LocationShape>(() => getCurrentLocation());

  useEffect(() => listen(() => setLocation(getCurrentLocation())), [getCurrentLocation, listen]);

  const navigate = useCallback(
    (to: string, options?: { replace?: boolean }) => {
      const next = pushLocation(normalizePath(to), options?.replace);
      setLocation({ pathname: next });
    },
    [pushLocation]
  );

  const contextValue = useMemo<RouterContextValue>(() => ({ location, navigate }), [location, navigate]);

  return (
    <RouterContext.Provider value={contextValue}>
      <RouteContext.Provider value={{ basePath: "/" }}>{children}</RouteContext.Provider>
    </RouterContext.Provider>
  );
};

export const BrowserRouter = ({ children }: RouterProps) => {
  if (typeof window === "undefined") {
    return (
      <HistoryRouter
        getCurrentLocation={() => ({ pathname: "/" })}
        pushLocation={(to) => to}
        listen={() => () => void 0}
      >
        {children}
      </HistoryRouter>
    );
  }

  const getCurrentLocation = () => ({ pathname: normalizePath(window.location.pathname || "/") });
  const pushLocation = (to: string, replace?: boolean) => {
    if (replace) {
      window.history.replaceState(null, "", to);
    } else {
      window.history.pushState(null, "", to);
    }
    window.dispatchEvent(new PopStateEvent("popstate"));
    return normalizePath(to);
  };
  const listen = (listener: () => void) => {
    window.addEventListener("popstate", listener);
    return () => window.removeEventListener("popstate", listener);
  };

  return (
    <HistoryRouter getCurrentLocation={getCurrentLocation} pushLocation={pushLocation} listen={listen}>
      {children}
    </HistoryRouter>
  );
};

type MemoryRouterProps = RouterProps & { initialEntries?: string[] };

export const MemoryRouter = ({ initialEntries, children }: MemoryRouterProps) => {
  const entries = initialEntries && initialEntries.length ? initialEntries : ["/"];
  const [locations, setLocations] = useState(() => entries.map((entry) => normalizePath(entry)));
  const [index, setIndex] = useState(() => Math.min(entries.length - 1, 0));

  const getCurrentLocation = () => ({ pathname: locations[Math.min(index, locations.length - 1)] });
  const pushLocation = (to: string, replace?: boolean) => {
    const next = normalizePath(to);
    setLocations((prev) => {
      if (replace) {
        const copy = [...prev];
        copy[Math.min(index, copy.length - 1)] = next;
        return copy;
      }
      const prefix = prev.slice(0, Math.min(index, prev.length - 1) + 1);
      return [...prefix, next];
    });
    setIndex((prev) => (replace ? prev : prev + 1));
    return next;
  };
  const listen = (_listener: () => void) => () => void 0;

  return (
    <HistoryRouter getCurrentLocation={getCurrentLocation} pushLocation={pushLocation} listen={listen}>
      {children}
    </HistoryRouter>
  );
};

export { Route };
export type { RouteProps };
