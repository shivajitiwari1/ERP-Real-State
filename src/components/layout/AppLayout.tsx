import { ReactNode, useEffect } from 'react';
import TopBar from './TopBar';
import NavMenu from './NavMenu';
import { initTheme } from '@/lib/theme';

export default function AppLayout({ children }: { children: ReactNode }) {
  useEffect(() => { initTheme(); }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', transition: 'background 0.3s ease' }}>
      <TopBar />
      <NavMenu />
      {/* Full-width main content — no max-width cap */}
      <main style={{ flex: 1, padding: '20px 24px', width: '100%' }} className="page-content">
        {children}
      </main>
      <footer style={{ background: 'var(--bg-navbar)', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '9px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 700, color: '#F97316', letterSpacing: '0.03em' }}>RealBoost ERP</span>
        <span style={{ fontSize: 11, color: '#475569' }}>Powered by <strong style={{ color: '#64748B' }}>4QT Technologies</strong> · v5.0</span>
      </footer>
    </div>
  );
}
