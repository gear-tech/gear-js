import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 5 * 60 * 1000,
      staleTime: Number.POSITIVE_INFINITY,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const QueryProvider = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

export { QueryProvider };
