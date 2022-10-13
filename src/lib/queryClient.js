import { QueryClient } from "@tanstack/solid-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnMount: true, refetchOnWindowFocus: true, cacheTime: 10_000, staleTime: 5_000 },
    mutations: {},
  },
});
