// src/services/cachePolicy.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Default 5 mins
      gcTime: 1000 * 60 * 60,   // Keep in memory 1 hour
      refetchOnWindowFocus: false, // Security: don't auto-fetch when switching tabs
    },
  },
});

/**
 * Technical Utility to wipe sensitive financial data from memory
 */
export const flushSecureCache = () => {
  queryClient.clear();
  sessionStorage.clear();
};
