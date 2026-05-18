import { ReactNode, useEffect } from 'react';
import TopBar from './TopBar';
import NavMenu from './NavMenu';
import { initTheme } from '@/lib/theme';
import SserpLogo from '@/components/shared/SserpLogo';

export default function AppLayout({ children }: { children: ReactNode }) {
  useEffect(() => { initTheme(); }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', transition: 'background 0.3s ease' }}>
      <TopBar />
      <NavMenu />
      {/* Full-width main content — no max-width cap */}
      <main style={{ flex: 1, padding: '24px', width: '100%', background: 'var(--bg)' }} className="page-content">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
          {children}
        </div>
      </main>
      <footer style={{ background: 'var(--bg-navbar)', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '9px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <SserpLogo iconSize={28} subTextColor="#94A3B8" />
        <span style={{ fontSize: 11, color: '#94A3B8' }}>Real Estate ERP · v5.0</span>
      </footer>
    </div>
  );
}
