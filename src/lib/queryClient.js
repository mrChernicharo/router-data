import { QueryClient } from "@tanstack/solid-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: true,
      cacheTime: 60_000,
      staleTime: 30_000,
    },
    mutations: {},
  },
});
