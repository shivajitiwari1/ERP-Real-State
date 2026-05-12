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
      <main style={{ flex: 1, padding: '20px', maxWidth: 1600, margin: '0 auto', width: '100%' }} className="page-content">
        {children}
      </main>
      <footer style={{ background: 'var(--bg-navbar)', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 600, color: '#F97316', letterSpacing: '0.02em' }}>RealBoost ERP</span>
        <span style={{ fontSize: 11, color: '#334155' }}>Powered by <span style={{ color: '#475569', fontWeight: 600 }}>4QT Technologies</span> · Version 5.0</span>
      </footer>
    </div>
  );
}
