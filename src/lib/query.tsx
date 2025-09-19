/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type QueryKey = readonly unknown[];

type QueryStatus = "idle" | "loading" | "success" | "error";

type QueryState<T> = {
  status: QueryStatus;
  data?: T;
  error?: unknown;
  updatedAt: number;
};

type Listener = () => void;

type QueryOptions<T> = {
  queryKey: QueryKey;
  queryFn: () => Promise<T>;
  enabled?: boolean;
};

export class QueryClient {
  private cache = new Map<string, QueryState<unknown>>();
  private listeners = new Map<string, Set<Listener>>();

  private hash(key: QueryKey): string {
    return JSON.stringify(key);
  }

  getState<T>(key: QueryKey): QueryState<T> | undefined {
    return this.cache.get(this.hash(key)) as QueryState<T> | undefined;
  }

  setState<T>(key: QueryKey, state: QueryState<T>) {
    const hashed = this.hash(key);
    this.cache.set(hashed, state);
    const subscribers = this.listeners.get(hashed);
    if (subscribers) {
      subscribers.forEach((listener) => listener());
    }
  }

  subscribe(key: QueryKey, listener: Listener) {
    const hashed = this.hash(key);
    if (!this.listeners.has(hashed)) {
      this.listeners.set(hashed, new Set());
    }
    const bucket = this.listeners.get(hashed)!;
    bucket.add(listener);
    return () => {
      bucket.delete(listener);
      if (bucket.size === 0) {
        this.listeners.delete(hashed);
      }
    };
  }

  invalidateQueries(partial?: QueryKey) {
    if (!partial || partial.length === 0) {
      this.cache.clear();
      this.listeners.forEach((bucket) => bucket.forEach((listener) => listener()));
      return;
    }
    const hashedPrefix = JSON.stringify(partial);
    for (const key of Array.from(this.cache.keys())) {
      if (key.startsWith(hashedPrefix)) {
        this.cache.delete(key);
        const bucket = this.listeners.get(key);
        bucket?.forEach((listener) => listener());
      }
    }
  }
}

const QueryClientContext = createContext<QueryClient | null>(null);

export function QueryClientProvider({
  client,
  children,
}: {
  client: QueryClient;
  children: React.ReactNode;
}) {
  const value = useMemo(() => client, [client]);
  return <QueryClientContext.Provider value={value}>{children}</QueryClientContext.Provider>;
}

export function useQueryClient() {
  const client = useContext(QueryClientContext);
  if (!client) {
    throw new Error("QueryClientProvider manquant dans l'arbre React.");
  }
  return client;
}

export function useQuery<T>({ queryKey, queryFn, enabled = true }: QueryOptions<T>) {
  const client = useQueryClient();
  const [state, setState] = useState<QueryState<T>>(() => {
    const cached = client.getState<T>(queryKey);
    if (cached) return cached;
    return { status: enabled ? "loading" : "idle", updatedAt: Date.now() };
  });
  const keyRef = useRef(queryKey);
  keyRef.current = queryKey;

  useEffect(() => {
    return client.subscribe(queryKey, () => {
      const latest = client.getState<T>(keyRef.current);
      if (latest) {
        setState(latest);
      }
    });
  }, [client, queryKey]);

  useEffect(() => {
    let ignore = false;
    if (!enabled) {
      setState((prev) => ({ ...prev, status: "idle" }));
      return () => {
        ignore = true;
      };
    }

    const cached = client.getState<T>(queryKey);
    if (cached && cached.status === "success") {
      setState(cached);
      return () => {
        ignore = true;
      };
    }

    const fetchData = async () => {
      client.setState<T>(queryKey, { status: "loading", data: cached?.data, updatedAt: Date.now() });
      try {
        const data = await queryFn();
        if (ignore) return;
        client.setState<T>(queryKey, { status: "success", data, updatedAt: Date.now() });
      } catch (error) {
        if (ignore) return;
        client.setState<T>(queryKey, { status: "error", error, updatedAt: Date.now() });
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, [client, enabled, queryFn, queryKey]);

  return {
    data: state.data as T | undefined,
    error: state.error,
    status: state.status,
    isLoading: state.status === "loading",
    isError: state.status === "error",
    isSuccess: state.status === "success",
  };
}

export function useMutation<TVariables, TResult>(
  mutationFn: (variables: TVariables) => Promise<TResult>,
  options?: { onSuccess?: (result: TResult) => void; invalidate?: QueryKey }
) {
  const client = useQueryClient();
  const [status, setStatus] = useState<QueryStatus>("idle");
  const [error, setError] = useState<unknown>(null);

  const mutate = useCallback(
    async (variables: TVariables) => {
      setStatus("loading");
      setError(null);
      try {
        const result = await mutationFn(variables);
        setStatus("success");
        options?.onSuccess?.(result);
        if (options?.invalidate) {
          client.invalidateQueries(options.invalidate);
        }
        return result;
      } catch (err) {
        setStatus("error");
        setError(err);
        throw err;
      }
    },
    [client, mutationFn, options]
  );

  return { mutate, status, error, isLoading: status === "loading" };
}
