"use client";

import * as React from "react";
import { ThemeProvider } from "next-themes";
import {
  QueryClientProvider,
  QueryClient,
  DefaultOptions,
} from "@tanstack/react-query";
import { useState } from "react";

const defaultOptions: DefaultOptions = {
  queries: {
    gcTime: 10 * 60 * 1000, 
    staleTime: 10 * 60 * 1000, 
    refetchOnWindowFocus: false, 
    refetchOnReconnect: true, 
    retry: 2,
  },
};

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient({ defaultOptions }));

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default Providers;
