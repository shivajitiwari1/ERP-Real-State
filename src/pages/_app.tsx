import { SessionProvider, useSession } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import AppLayout from '@/components/layout/AppLayout';
import '@/styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30000 } },
});

const PUBLIC_PATHS = ['/login', '/403', '/tools'];

function AppContent({ Component, pageProps }: { Component: any; pageProps: any }) {
  const { status } = useSession();
  const router = useRouter();
  const isPublic = PUBLIC_PATHS.some(p => router.pathname.startsWith(p));

  if (isPublic) return <Component {...pageProps} />;
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-slate-600 text-sm">Loading...</div>
      </div>
    );
  }
  return <AppLayout><Component {...pageProps} /></AppLayout>;
}

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <AppContent Component={Component} pageProps={pageProps} />
      </QueryClientProvider>
    </SessionProvider>
  );
}
