import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { initTheme, applyTheme } from '@/lib/theme';

export default function TopBar() {
  const { data: session } = useSession();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const t = initTheme();
    setTheme(t);
  }, []);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    applyTheme(next);
  }

  const initial = session?.user?.name?.[0]?.toUpperCase() || 'A';

  return (
    <div style={{ height: 54, background: 'var(--bg-topbar)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', position: 'sticky', top: 0, zIndex: 50, transition: 'background 0.3s ease' }}>

      {/* ── Left: Brand ── */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <div style={{ width: 12, height: 12, background: '#F97316', borderRadius: 2 }} />
            <div style={{ width: 12, height: 12, background: '#F97316', borderRadius: 2 }} />
            <div style={{ width: 12, height: 6, background: '#F97316', borderRadius: 2 }} />
            <div style={{ width: 12, height: 6, background: '#F97316', borderRadius: 2 }} />
          </div>
        </div>
        <div>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 15, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Real<span style={{ color: '#F97316' }}>Boost</span>
          </div>
          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', lineHeight: 1 }}>Real Estate ERP</div>
        </div>
      </Link>

      {/* ── Center: Status ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 0 2px rgba(34,197,94,0.2)' }} />
        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: "'Outfit', sans-serif" }}>
          {dayjs().format('ddd, DD MMM YYYY')}
        </span>
      </div>

      {/* ── Right: Controls ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

        {/* Theme toggle */}
        <button onClick={toggleTheme} title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          style={{ width: 34, height: 34, border: '1px solid var(--border)', borderRadius: 8, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 15, transition: 'all 0.15s ease', color: 'var(--text-muted)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#F97316'; (e.currentTarget as HTMLElement).style.color = '#F97316'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* Divider */}
        <div style={{ width: 1, height: 20, background: 'var(--border)' }} />

        {/* Home */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', border: '1px solid var(--border)', borderRadius: 7, fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none', transition: 'all 0.15s ease', fontFamily: "'Outfit', sans-serif", fontWeight: 500, background: 'var(--bg)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#F97316'; (e.currentTarget as HTMLElement).style.color = '#F97316'; (e.currentTarget as HTMLElement).style.background = 'rgba(249,115,22,0.06)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; (e.currentTarget as HTMLElement).style.background = 'var(--bg)'; }}>
          🏠 Home
        </Link>

        {/* User menu */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowUserMenu(!showUserMenu)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 10px 4px 4px', border: '1px solid var(--border)', borderRadius: 99, background: 'var(--bg)', cursor: 'pointer', transition: 'all 0.15s ease' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#F97316')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
            {/* Avatar */}
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, #F97316, #EA6C0A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 11, color: '#fff' }}>
              {initial}
            </div>
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', fontFamily: "'Outfit', sans-serif", maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {session?.user?.name || 'User'}
            </span>
            <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>▾</span>
          </button>

          {showUserMenu && (
            <>
              {/* Backdrop */}
              <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setShowUserMenu(false)} />
              <div className="erp-dropdown" style={{ position: 'absolute', right: 0, top: 'calc(100% + 6px)', minWidth: 180, zIndex: 100 }}>
                <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: 'var(--text)', fontFamily: "'Outfit', sans-serif" }}>{session?.user?.name}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-muted)' }}>{session?.user?.email}</p>
                </div>
                <Link href="/master/security/password" className="erp-dropdown-item" onClick={() => setShowUserMenu(false)}>
                  🔑 Change Password
                </Link>
                <button onClick={() => { setShowUserMenu(false); signOut({ callbackUrl: '/login' }); }}
                  className="erp-dropdown-item" style={{ width: '100%', textAlign: 'left', border: 'none', background: 'none', color: '#EF4444', cursor: 'pointer' }}>
                  🚪 Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
