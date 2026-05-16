import { SessionProvider, useSession } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Head from 'next/head';
import AppLayout from '@/components/layout/AppLayout';
import { initTheme } from '@/lib/theme';
import '@/styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30000 } },
});

const PUBLIC_PATHS = ['/login', '/403', '/tools'];

function AppContent({ Component, pageProps }: { Component: any; pageProps: any }) {
  const { status } = useSession();
  const router = useRouter();
  const isPublic = PUBLIC_PATHS.some(p => router.pathname.startsWith(p));

  // Init theme on every authenticated page load
  useEffect(() => { if (!isPublic) initTheme(); }, [isPublic]);

  if (isPublic) return <Component {...pageProps} />;

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <div style={{ width: 28, height: 28, border: '2px solid var(--border)', borderTopColor: '#F97316', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: 'var(--text-muted)' }}>Loading RealBoost...</span>
      </div>
    );
  }

  return <AppLayout><Component {...pageProps} /></AppLayout>;
}

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  // Apply theme before first render to prevent flash
  useEffect(() => { initTheme(); }, []);

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        </Head>
        <AppContent Component={Component} pageProps={pageProps} />
      </QueryClientProvider>
    </SessionProvider>
  );
}
